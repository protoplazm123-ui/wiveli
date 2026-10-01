import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Authentication is not configured." },
        { status: 500 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Enter your email and password." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.error_description ||
            data.msg ||
            data.message ||
            "Incorrect email or password.",
        },
        { status: response.status }
      );
    }

    const result = NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });

    result.cookies.set("wiveli_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.expires_in || 3600,
    });

    result.cookies.set("wiveli_refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return result;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Could not log in." },
      { status: 500 }
    );
  }
}
