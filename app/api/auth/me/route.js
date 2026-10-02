import { NextResponse } from "next/server";
import { requireSession, publicProfile } from "../../../lib/session";
export async function GET() {
  try { const {user} = await requireSession(); return NextResponse.json({authenticated: true, id: user.id, ...publicProfile(user)}, {headers: {"Cache-Control": "private, no-store"}}); }
  catch (error) { return NextResponse.json({authenticated: false, error: error.message}, {status: error.status || 500}); }
}
