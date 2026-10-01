import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("wiveli_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const user = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,

      id: user.id,
      email: user.email,

      name:
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "WIVELI User",

      avatar:
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        "",
    });
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
