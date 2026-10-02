import { readFileSync } from "node:fs";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";

const GIFT_ID = "11111111-1111-4111-8111-111111111111";
const CLAIM_TOKEN = "22222222-2222-4222-8222-222222222222";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const clean = source => source.replace(/^import .*;\n/gm, "").replaceAll("export ", "");
function setup(options = {}) {
  const messages = new Map();
  let sends = 0, patches = 0;
  const payloads = [];
  const invitations = new Map();
  const gift = {
    senderName: "Julia", recipientName: "Sam", couponIds: ["dinner"],
    customCoupons: [{ id: "dinner", title: "<Dinner>", reminderEnabled: options.remind ?? true }],
    dailyLimit: 3, redemptions: options.redeemed === false ? [] : [{ couponId: "dinner", code: "LOVE-1234" }],
  };
  const participants = [
    { role: "sender", user_id: "sender", gift_id: GIFT_ID },
    { role: "recipient", user_id: "recipient", gift_id: GIFT_ID, claim_token: CLAIM_TOKEN },
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
      if (u.pathname.endsWith("/wiveli_account_events")) return response([body]);
      if (u.pathname === "/auth/v1/user") return response({ id: options.user || "recipient" });
      if (u.hostname === "api.telegram.org") {
        if (u.pathname.endsWith("/getMe")) return response({ ok: true, result: { username: "WIVELI_bot" } });
        if (u.pathname.endsWith("/answerCallbackQuery")) return response({ ok: true });
        if (u.pathname.endsWith("/getChat")) return response({ ok: true, result: { type: "private", username: options.changedUsername ? "someone_else" : "sam_user" } });
        sends++;
        payloads.push(body);
        if (options.timeout) throw Error("Network timeout");
        if (options.blocked) return response({ ok: false }, 403);
        assert.equal(body.parse_mode, undefined, "User text must not be interpreted as HTML");
        return response({ ok: true, result: { message_id: 55 } });
      }
      if (u.pathname.endsWith("/gift_participants")) {
        const token = u.searchParams.get("claim_token");
        return response(participants.filter(p => (!token || "eq." + p.claim_token === token) && (!u.searchParams.get("role") || "eq." + p.role === u.searchParams.get("role"))));
      }
      if (u.pathname.endsWith("/wiveli_gift_invitations")) {
        if (init.method === "POST") { invitations.set(body.gift_id, body); return response([body]); }
        const row = invitations.get(u.searchParams.get("gift_id")?.slice(3));
        return response(row ? [row] : []);
      }
      if (u.pathname.endsWith("/wiveli_telegram_contacts")) {
        if (init.method === "POST") return response([body]);
        return response(options.disconnected ? [] : [connection]);
      }
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
        return response([{ id: "gift", gift_type: options.giftType || "love-coupons", gift_data: JSON.parse(JSON.stringify(gift)) }]);
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
  vm.runInContext(clean(read("app/lib/session.js")), context);
  vm.runInContext(clean(read("app/lib/gift-telegram.js")), context);
  vm.runInContext(clean(read("app/lib/recipient-response.js")), context);
  vm.runInContext(clean(read("app/lib/gift-links.js")), context);
  const helper = vm.runInContext("({ sendOnce, notifySender })", context);
  context.sendGiftOnce = helper.sendOnce;
  return {
    messages, gift, helper, payloads, invitations, sends: () => sends, patches: () => patches,
    route(name, method = "POST") {
      vm.runInContext(clean(read(name === "webhook" ? "app/api/telegram/webhook/route.js" : name === "read" ? "app/api/gifts/[id]/route.js" : `app/api/gifts/[id]/${name}/route.js`)), context);
      return (body = {}) => context[method]({ url: `https://site.test/api/gifts/${GIFT_ID}/${name}`, headers: { get: name => name === "x-wiveli-gift-token" ? options.guestToken || null : null }, json: async () => body }, { params: Promise.resolve({ id: GIFT_ID }) });
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

test("guest can read, redeem and notify without a WIVELI account", async () => {
  const s = setup({ anonymous: true, guestToken: CLAIM_TOKEN, redeemed: false });
  assert.equal((await s.route("read", "GET")()).status, 200);
  assert.equal((await s.route("redeem")({ couponId: "dinner" })).status, 200);
  assert.equal((await s.route("notify")({ couponId: "dinner" })).status, 200);
  assert.equal(s.sends(), 1);
});
test("missing or incorrect private token cannot read, redeem or notify", async () => {
  for (const token of [undefined, "33333333-3333-4333-8333-333333333333"]) {
    for (const name of ["read", "redeem", "notify", "opened"]) {
      const s = setup({ anonymous: true, guestToken: token });
      const result = await s.route(name, name === "read" ? "GET" : "POST")({ couponId: "dinner" });
      assert.ok([401,403].includes(result.status));
      assert.equal(s.sends(), 0);
    }
  }
});
test("first opening notifies sender once; coupon use is a separate notification", async () => {
  const s = setup({ anonymous: true, guestToken: CLAIM_TOKEN });
  const opened = s.route("opened");
  assert.equal((await opened()).status, 200);
  assert.equal((await opened()).body.alreadySent, true);
  assert.equal(s.sends(), 1);
  assert.equal((await s.route("notify")({ couponId: "dinner" })).status, 200);
  assert.equal(s.sends(), 2);
});
test("signed-in sender preview does not trigger opening notification", async () => {
  const s = setup({ user: "sender", guestToken: CLAIM_TOKEN });
  const result = await s.route("opened")();
  assert.equal(result.body.preview, true);
  assert.equal(s.sends(), 0);
});
test("sender invitation leads from bot Start directly to gift without signup", async () => {
  const s = setup({ user: "sender" });
  const invitation = await s.route("deliver", "GET")();
  assert.equal(invitation.body.inviteUrl, `https://t.me/WIVELI_bot?start=gift_${CLAIM_TOKEN}`);
  const webhook = s.route("webhook");
  const update = { message: { chat: { id: 22, type: "private" }, from: { id: 22, username: "sam_user" }, text: `/start gift_${CLAIM_TOKEN}` } };
  assert.equal((await webhook(update)).status, 200);
  assert.equal(s.sends(), 1);
  assert.match(s.payloads[0].text, /Julia/);
  assert.equal(s.payloads[0].reply_markup.inline_keyboard[0][0].url, `https://site.test/gift/love-coupons/${GIFT_ID}?claim=${CLAIM_TOKEN}`);
  assert.equal((await webhook(update)).status, 200);
  assert.equal(s.sends(), 1);
});
test("direct bot gift Start button is bound to its destination chat", async () => {
  const s = setup({ user: "sender" });
  assert.equal((await s.route("deliver")({ recipientUsername: "sam_user" })).status, 200);
  assert.equal(s.payloads[0].reply_markup.inline_keyboard[0][0].callback_data, `gift_start:${GIFT_ID}`);
  const webhook = s.route("webhook");
  const result = await webhook({ callback_query: {
    id: "callback", from: { id: 22 }, message: { chat: { id: 22, type: "private" } },
    data: `gift_start:${GIFT_ID}`,
  } });
  assert.equal(result.status, 200);
  assert.equal(s.sends(), 2);
  assert.match(s.payloads[1].reply_markup.inline_keyboard[0][0].url, /claim=/);
});

test("guest answers persist with redemption and invalid answers do not write", async () => {
 const s = setup({anonymous: true, guestToken: CLAIM_TOKEN, redeemed: false});
 const run = s.route("redeem");
 assert.equal((await run({couponId:"dinner",recipientResponse:{time:"99:00"}})).status,400);
 assert.equal(s.patches(),0);
 assert.equal((await run({couponId:"dinner",timeZone:"UTC",recipientResponse:{choice:"Film",date:"2026-10-05",time:"19:30",place:"Cinema",note:"See you"}})).status,200);
 assert.equal(s.gift.redemptions[0].recipientResponse.place,"Cinema");
 assert.equal(s.gift.redemptions[0].recipientResponse.timeZone,"UTC");
});

test("Wish Note invitation opens Wish Note without signup", async () => {
  const s = setup({ user: "sender", giftType: "wish-note" });
  const invitation = await s.route("deliver", "GET")();
  assert.equal(invitation.body.inviteUrl, `https://t.me/WIVELI_bot?start=gift_${CLAIM_TOKEN}`);
  const webhook = s.route("webhook");
  const update = { message: { chat: { id: 22, type: "private" }, from: { id: 22, username: "sam_user" }, text: `/start gift_${CLAIM_TOKEN}` } };
  assert.equal((await webhook(update)).status, 200);
  assert.equal(s.sends(), 1);
  assert.match(s.payloads[0].text, /Julia/);
  assert.equal(s.payloads[0].reply_markup.inline_keyboard[0][0].url, `https://site.test/gift/wish-note/${GIFT_ID}?claim=${CLAIM_TOKEN}`);
  assert.equal((await webhook(update)).status, 200);
  assert.equal(s.sends(), 1);
});

test("Our Story invitation opens Our Story without signup", async () => {
  const s = setup({ user: "sender", giftType: "our-story" });
  const invitation = await s.route("deliver", "GET")();
  assert.equal(invitation.body.inviteUrl, `https://t.me/WIVELI_bot?start=gift_${CLAIM_TOKEN}`);
  const webhook = s.route("webhook");
  const update = { message: { chat: { id: 22, type: "private" }, from: { id: 22, username: "sam_user" }, text: `/start gift_${CLAIM_TOKEN}` } };
  assert.equal((await webhook(update)).status, 200);
  assert.equal(s.sends(), 1);
  assert.match(s.payloads[0].text, /Julia/);
  assert.equal(s.payloads[0].reply_markup.inline_keyboard[0][0].url, `https://site.test/gift/our-story/${GIFT_ID}?claim=${CLAIM_TOKEN}`);
  assert.equal((await webhook(update)).status, 200);
  assert.equal(s.sends(), 1);
});

test("Open When invitation opens Open When without signup", async () => {
  const s = setup({ user: "sender", giftType: "open-when" });
  const invitation = await s.route("deliver", "GET")();
  assert.equal(invitation.body.inviteUrl, `https://t.me/WIVELI_bot?start=gift_${CLAIM_TOKEN}`);
  const webhook = s.route("webhook");
  const update = { message: { chat: { id: 22, type: "private" }, from: { id: 22, username: "sam_user" }, text: `/start gift_${CLAIM_TOKEN}` } };
  assert.equal((await webhook(update)).status, 200);
  assert.equal(s.sends(), 1);
  assert.match(s.payloads[0].text, /Julia/);
  assert.equal(s.payloads[0].reply_markup.inline_keyboard[0][0].url, `https://site.test/gift/open-when/${GIFT_ID}?claim=${CLAIM_TOKEN}`);
  assert.equal((await webhook(update)).status, 200);
  assert.equal(s.sends(), 1);
});
