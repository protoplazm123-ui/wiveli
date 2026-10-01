import { readFileSync } from "node:fs";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const clean = source => source.replace(/^import .*;\n/gm, "").replaceAll("export ", "");
function setup(options = {}) {
  const messages = new Map();
  let sends = 0, patches = 0;
  const gift = {
    senderName: "Julia", recipientName: "Sam", couponIds: ["dinner"],
    customCoupons: [{ id: "dinner", title: "<Dinner>", reminderEnabled: options.remind ?? true }],
    dailyLimit: 3, redemptions: options.redeemed === false ? [] : [{ couponId: "dinner", code: "LOVE-1234" }],
  };
  const participants = [
    { role: "sender", user_id: "sender", gift_id: "gift" },
    { role: "recipient", user_id: "recipient", gift_id: "gift", claim_token: "private-token" },
  ];
  const connection = { user_id: "recipient", connected: true, telegram_chat_id: 22, telegram_username: "sam_user" };
  const response = (value, status = 200) => ({
    ok: status >= 200 && status < 300, status,
    json: async () => value, text: async () => JSON.stringify(value),
  });
  const context = vm.createContext({
    URL, AbortSignal, crypto: webcrypto, couponIdeas: [],
    console: { error() {}, log() {}, warn() {} },
    process: { env: { SUPABASE_URL: "https://db.test", SUPABASE_SECRET_KEY: "secret", NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon", TELEGRAM_BOT_TOKEN: "bot-token" } },
    cookies: async () => ({ get: () => options.anonymous ? undefined : { value: "session" } }),
    NextResponse: { json: (body, init) => ({ body, status: init?.status || 200 }) },
    fetch: async (url, init = {}) => {
      const u = new URL(url), body = init.body ? JSON.parse(init.body) : {};
      if (u.pathname === "/auth/v1/user") return response({ id: options.user || "recipient" });
      if (u.hostname === "api.telegram.org") {
        if (u.pathname.endsWith("/getChat")) return response({ ok: true, result: { type: "private", username: options.changedUsername ? "someone_else" : "sam_user" } });
        sends++;
        if (options.timeout) throw Error("Network timeout");
        if (options.blocked) return response({ ok: false }, 403);
        assert.equal(body.parse_mode, undefined, "User text must not be interpreted as HTML");
        return response({ ok: true, result: { message_id: 55 } });
      }
      if (u.pathname.endsWith("/gift_participants")) return response(participants);
      if (u.pathname.endsWith("/telegram_connections")) {
        if (options.disconnected) return response([]);
        if (u.searchParams.get("user_id") === "eq.sender") return response([{ ...connection, user_id: "sender", telegram_chat_id: 11 }]);
        return response([connection]);
      }
      if (u.pathname.endsWith("/gifts") || u.pathname.endsWith("/rpc/wiveli_save_redemption")) {
        if (u.pathname.endsWith("/rpc/wiveli_save_redemption")) {
          patches++;
          if (options.conflict) return response([]);
          assert.ok(body.p_expected);
          Object.assign(gift, body.p_updated);
        }
        return response([{ id: "gift", gift_type: "love-coupons", gift_data: JSON.parse(JSON.stringify(gift)) }]);
      }
      if (u.pathname.endsWith("/wiveli_telegram_messages")) {
        const key = init.method === "POST" ? body.message_key : u.searchParams.get("message_key")?.slice(3);
        const previous = messages.get(key);
        if (init.method === "POST") {
          if (previous) return response([]);
          messages.set(key, body); return response([body]);
        }
        if (init.method === "PATCH") {
          if (u.searchParams.get("status") && previous?.status !== u.searchParams.get("status").slice(3)) return response([]);
          Object.assign(previous, body); return response([previous]);
        }
        return response(previous ? [previous] : []);
      }
      throw Error("Unexpected fetch: " + url);
    },
  });
  vm.runInContext(clean(read("app/lib/gift-telegram.js")), context);
  const helper = vm.runInContext("({ sendOnce, notifySender })", context);
  return {
    messages, gift, helper, sends: () => sends, patches: () => patches,
    route(name) {
      vm.runInContext(clean(read(`app/api/gifts/[id]/${name}/route.js`)), context);
      return (body = {}) => context.POST({ url: `https://site.test/api/gifts/gift/${name}`, json: async () => body }, { params: Promise.resolve({ id: "gift" }) });
    },
  };
}

test("sender can deliver a gift; repeated request does not send twice", async () => {
  const s = setup({ user: "sender" }), run = s.route("deliver");
  assert.equal((await run({ recipientUsername: "@sam_user" })).status, 200);
  assert.equal((await run({ recipientUsername: "@sam_user" })).body.alreadySent, true);
  assert.equal(s.sends(), 1);
});
test("anonymous and unrelated users cannot send gifts", async () => {
  for (const options of [{ anonymous: true }, { user: "stranger" }]) {
    const s = setup(options);
    assert.ok([401, 403].includes((await s.route("deliver")({ recipientUsername: "sam_user" })).status));
    assert.equal(s.sends(), 0);
  }
});
test("changed username is rejected before private gift delivery", async () => {
  const s = setup({ user: "sender", changedUsername: true });
  assert.equal((await s.route("deliver")({ recipientUsername: "sam_user" })).status, 409);
  assert.equal(s.sends(), 0);
});
test("recipient receives a clear failure if sender has not connected Telegram", async () => {
  const s = setup({ disconnected: true });
  assert.equal((await s.route("notify")({ couponId: "dinner" })).status, 409);
  assert.equal(s.sends(), 0);
});
test("only claimed recipient can notify, and only for an actually redeemed coupon", async () => {
  const stranger = setup({ user: "stranger" });
  assert.equal((await stranger.route("notify")({ couponId: "dinner" })).status, 403);
  const unused = setup({ redeemed: false });
  assert.equal((await unused.route("notify")({ couponId: "dinner" })).status, 400);
  assert.equal(unused.sends(), 0);
});
test("concurrent notifications reserve a single message", async () => {
  const s = setup(), run = s.route("notify");
  const results = await Promise.all([run({ couponId: "dinner" }), run({ couponId: "dinner" })]);
  assert.ok(results.some(r => r.status === 200));
  assert.equal(s.sends(), 1);
});
test("uncertain Telegram delivery cannot cause a duplicate retry", async () => {
  const s = setup({ timeout: true }), run = s.route("notify");
  assert.equal((await run({ couponId: "dinner" })).status, 502);
  assert.equal((await run({ couponId: "dinner" })).status, 409);
  assert.equal(s.sends(), 1);
});
test("a confirmed rejection remains retryable and is never marked sent", async () => {
  const s = setup({ blocked: true }), run = s.route("notify");
  assert.equal((await run({ couponId: "dinner" })).status, 502);
  assert.equal(s.messages.values().next().value.status, "failed");
  assert.equal((await run({ couponId: "dinner" })).status, 502);
  assert.equal(s.sends(), 2);
});
test("redemption sends automatic reminder and manual button does not duplicate it", async () => {
  const s = setup({ redeemed: false });
  const result = await s.route("redeem")({ couponId: "dinner", timeZone: "UTC" });
  assert.equal(result.status, 200);
  assert.equal(result.body.notification.sent, true);
  assert.equal(s.patches(), 1);
  assert.equal((await s.route("notify")({ couponId: "dinner" })).body.alreadySent, true);
  assert.equal(s.sends(), 1);
});
test("bot failure does not roll back a redeemed coupon", async () => {
  const s = setup({ redeemed: false, blocked: true });
  const result = await s.route("redeem")({ couponId: "dinner", timeZone: "UTC" });
  assert.equal(result.status, 200);
  assert.equal(result.body.notification.sent, false);
  assert.equal(s.gift.redemptions.length, 1);
});
test("automatic reminder respects coupon toggle; failed concurrent save never notifies", async () => {
  const off = setup({ redeemed: false, remind: false });
  assert.equal((await off.route("redeem")({ couponId: "dinner" })).status, 200);
  assert.equal(off.sends(), 0);
  const conflict = setup({ redeemed: false, conflict: true });
  assert.equal((await conflict.route("redeem")({ couponId: "dinner" })).status, 409);
  assert.equal(conflict.sends(), 0);
});
