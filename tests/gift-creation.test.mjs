import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import assert from "node:assert/strict";

const route = readFileSync(new URL("../app/api/gifts/route.js", import.meta.url), "utf8")
  .replace(/^import .*;\n/gm, "").replace("export async function POST", "async function POST");
const page = readFileSync(new URL("../app/experiences/love-coupons/personalize/page.js", import.meta.url), "utf8");
const action = page.slice(page.indexOf("const createGift ="), page.indexOf("  const copyGiftLink"));

function api({ loggedIn = true, participantsFail = false } = {}) {
  const calls = [];
  const context = vm.createContext({
    URL, crypto: { randomUUID: () => "claim-token" }, console: { error() {} },
    process: { env: { SUPABASE_URL: "https://db.example", SUPABASE_SECRET_KEY: "secret", NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon" } },
    cookies: async () => ({ get: () => loggedIn ? { value: "session" } : undefined }),
    NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) },
    fetch: async (url, options = {}) => {
      calls.push({ url, ...options });
      if (url.endsWith("/auth/v1/user")) return { ok: true, json: async () => ({ id: "sender", email: "sender@example.com" }) };
      if (options.method === "DELETE") return { ok: true };
      if (url.endsWith("/gift_participants")) {
        const rows = JSON.parse(options.body);
        // PostgREST requires uniform keys for JSON bulk inserts.
        assert.deepEqual(Object.keys(rows[0]).sort(), Object.keys(rows[1]).sort());
        assert.equal(rows[0].claim_token, null);
        assert.equal(rows[1].claim_token, "claim-token");
        return { ok: !participantsFail, text: async () => "database failure" };
      }
      return { ok: true, json: async () => [{ id: "gift-123" }] };
    },
  });
  vm.runInContext(route, context);
  return { calls, run: () => context.POST({ url: "https://preview.example/api/gifts", json: async () => ({ giftType: "love-coupons", giftData: { senderName: "Julia" } }) }) };
}

test("gift saves and recipient link keeps origin, route and claim token", async () => {
  const { run, calls } = api();
  const result = await run();
  assert.equal(result.status, 200);
  assert.equal(result.body.giftUrl, "https://preview.example/gift/love-coupons/gift-123?claim=claim-token");
  assert.equal(calls.length, 3);
});

test("unauthenticated request never writes a gift", async () => {
  const { run, calls } = api({ loggedIn: false });
  assert.equal((await run()).status, 401);
  assert.equal(calls.length, 0);
});

test("failed participant insert removes incomplete gift", async () => {
  const { run, calls } = api({ participantsFail: true });
  assert.equal((await run()).status, 500);
  assert.equal(calls.at(-1).method, "DELETE");
});

async function client({ status = 200, cacheFails = false, invalidJson = false } = {}) {
  const state = {};
  const context = vm.createContext({
    creating: false, senderName: "Julia", recipientName: "Sam", senderTelegram: "",
    selectedCoupons: [{ id: "coupon" }], selected: ["coupon"], customCoupons: [], dailyLimit: 3,
    setCreating: value => state.creating = value,
    setCreateError: value => state.error = value,
    setRequiresLogin: value => state.requiresLogin = value,
    setGiftUrl: value => state.url = value,
    setModal: value => state.modal = value,
    window: { location: { origin: "https://preview.example" } },
    console: { error() {}, warn() {} },
    saveLoveCouponsGift: () => { if (cacheFails) throw Error("Storage blocked"); },
    fetch: async () => ({
      ok: status === 200, status,
      json: async () => {
        if (invalidJson) throw Error("Invalid JSON");
        return status === 200 ? { success: true, id: "gift-123", claimToken: "claim-token" } : { error: "Please sign in before creating a gift." };
      },
    }),
  });
  await vm.runInContext(action + "\ncreateGift();", context);
  return state;
}

test("browser cache failure does not hide success or drop claim token", async () => {
  const state = await client({ cacheFails: true });
  assert.equal(state.modal, "send");
  assert.equal(state.url, "https://preview.example/gift/love-coupons/gift-123?claim=claim-token");
  assert.equal(state.creating, false);
  assert.equal(state.error, "");
});

test("expired login gives actionable error and releases loading state", async () => {
  const state = await client({ status: 401 });
  assert.equal(state.requiresLogin, true);
  assert.match(state.error, /sign in/);
  assert.equal(state.creating, false);
  assert.equal(state.modal, undefined);
});

test("non-JSON server failure shows HTTP status and releases loading state", async () => {
  const state = await client({ status: 502, invalidJson: true });
  assert.match(state.error, /HTTP 502/);
  assert.equal(state.creating, false);
});
