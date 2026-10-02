import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireSession } from "../../../lib/session";

export async function POST(request) {
  try {
    const {user} = await requireSession();
    if (Number(request.headers.get("content-length")) > 2200000) return NextResponse.json({error: "Choose an image smaller than 2 MB."}, {status: 413});
    const file = (await request.formData()).get("photo");
    if (!file || typeof file.arrayBuffer !== "function" || file.size > 2 * 1024 * 1024 || file.size < 12) return NextResponse.json({error: "Choose a JPG, PNG or WebP image smaller than 2 MB."}, {status: 400});
    const bytes = Buffer.from(await file.arrayBuffer());
    const extension = bytes.subarray(0,3).equals(Buffer.from([255,216,255])) ? "jpg" : bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "png" : bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP" ? "webp" : null;
    if (!extension) return NextResponse.json({error: "Unsupported image. Use JPG, PNG or WebP."}, {status: 400});
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!key) throw new Error("Photo storage is not configured.");
    const path = `${user.id}/${randomUUID()}.${extension}`;
    const response = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/wiveli-avatars/${path}`, {method: "POST", headers: {apikey: key, Authorization: `Bearer ${key}`, "Content-Type": `image/${extension === "jpg" ? "jpeg" : extension}`}, body: bytes});
    if (!response.ok) throw new Error("Could not upload photo. Please check photo storage setup.");
    return NextResponse.json({avatar: `${process.env.SUPABASE_URL}/storage/v1/object/public/wiveli-avatars/${path}`});
  } catch (error) { return NextResponse.json({error: error.message}, {status: error.status || 500}); }
}
