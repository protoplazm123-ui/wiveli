import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Authentication is not configured." },
        { status: 500 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Enter a valid email and password." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/auth/v1/signup`,
      {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
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
            data.msg ||
            data.message ||
            "Could not create account.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Could not create account." },
      { status: 500 }
    );
  }
}
