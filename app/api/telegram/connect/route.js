import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken =
      cookieStore.get("wiveli_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !secretKey || !anonKey) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 500 }
      );
    }

    // Получаем пользователя по его WIVELI-сессии
    const userResponse = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const user = await userResponse.json();

    if (!userResponse.ok || !user?.id) {
      return NextResponse.json(
        { error: "Session expired." },
        { status: 401 }
      );
    }

    // Одноразовый код для Telegram
    const connectCode = crypto.randomBytes(24).toString("hex");

    const saveResponse = await fetch(
      `${supabaseUrl}/rest/v1/telegram_connections?user_id=eq.${user.id}`,
      {
        method: "DELETE",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (!saveResponse.ok) {
      throw new Error("Could not reset Telegram connection.");
    }

    const createResponse = await fetch(
      `${supabaseUrl}/rest/v1/telegram_connections`,
      {
        method: "POST",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: user.id,
          connect_code: connectCode,
          connected: false,
        }),
      }
    );

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error(error);

      throw new Error("Could not create Telegram connection.");
    }

    return NextResponse.json({
      success: true,
      connectCode,
    });
  } catch (error) {
    console.error("Telegram connect error:", error);

    return NextResponse.json(
      { error: "Could not connect Telegram." },
      { status: 500 }
    );
  }
}
