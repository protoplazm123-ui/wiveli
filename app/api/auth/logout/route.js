import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST() {
  const store = await cookies();
  for (const name of ["wiveli_access_token", "wiveli_refresh_token"]) store.set(name, "", {httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0});
  return NextResponse.json({success: true});
}
