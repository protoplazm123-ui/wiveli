import { NextResponse } from "next/server";
import { requireSession, publicProfile } from "../../../lib/session";

export async function GET() {
  try { const {user} = await requireSession(); return NextResponse.json({profile: publicProfile(user)}, {headers: {"Cache-Control": "private, no-store"}}); }
  catch (error) { return NextResponse.json({error: error.message}, {status: error.status || 500}); }
}
export async function PUT(request) {
  try {
    const {user, accessToken} = await requireSession();
    const {name, email, avatar} = await request.json();
    if (typeof name !== "string" || !name.trim() || name.length > 100 || typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return NextResponse.json({error: "Enter your name and a valid email."}, {status: 400});
    const current = publicProfile(user);
    const prefix = `${process.env.SUPABASE_URL}/storage/v1/object/public/wiveli-avatars/${user.id}/`;
    if (typeof avatar !== "string" || (avatar !== current.avatar && avatar !== "" && (!avatar.startsWith(prefix) || !/^[a-f0-9-]+\.(jpg|png|webp)$/.test(avatar.slice(prefix.length))))) return NextResponse.json({error: "Please upload your profile photo first."}, {status: 400});
    const nextEmail = email.trim().toLowerCase();
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      method: "PUT", headers: {apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"},
      body: JSON.stringify({data: {name: name.trim(), avatar_url: avatar}, ...(nextEmail !== user.email ? {email: nextEmail} : {})}), cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({error: data.msg || data.message || "Could not save your profile."}, {status: response.status});
    return NextResponse.json({profile: publicProfile(data), emailConfirmationRequired: nextEmail !== data.email, pendingEmail: nextEmail !== data.email ? nextEmail : null});
  } catch (error) { return NextResponse.json({error: error.message || "Could not save profile."}, {status: error.status || 500}); }
}
