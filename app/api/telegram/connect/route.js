import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { requireSession } from "../../../lib/session";
import { database, connectionForUser } from "../../../lib/gift-telegram";

export async function GET() {
  try {
    const {user} = await requireSession();
    const connection = await connectionForUser(user.id);
    return NextResponse.json({connected: Boolean(connection?.telegram_chat_id), username: connection?.telegram_username || null}, {headers: {"Cache-Control": "private, no-store"}});
  } catch (error) { return NextResponse.json({error: error.message}, {status: error.status || 500}); }
}
export async function POST() {
  try {
    const {user} = await requireSession();
    const connection = await connectionForUser(user.id);
    if (connection?.telegram_chat_id) return NextResponse.json({connected: true, username: connection.telegram_username || null});
    const connectCode = randomBytes(24).toString("hex");
    await database("wiveli_telegram_link_codes?on_conflict=user_id", {
      method: "POST", headers: {Prefer: "resolution=merge-duplicates,return=representation"},
      body: JSON.stringify({user_id: user.id, code: connectCode, expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()}),
    });
    return NextResponse.json({connected: false, connectCode, url: `https://t.me/WIVELI_bot?start=${connectCode}`}, {headers: {"Cache-Control": "private, no-store"}});
  } catch (error) { return NextResponse.json({error: error.message || "Could not connect Telegram."}, {status: error.status || 500}); }
}
