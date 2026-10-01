import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Telegram bot is not configured." },
        { status: 500 }
      );
    }

    const { chatId, text } = await request.json();

    if (!chatId || !text) {
      return NextResponse.json(
        { error: "chatId and text are required." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram error:", data);

      return NextResponse.json(
        {
          error:
            data.description || "Could not send Telegram message.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data.result?.message_id,
    });
  } catch (error) {
    console.error("Telegram send error:", error);

    return NextResponse.json(
      { error: "Could not send Telegram message." },
      { status: 500 }
    );
  }
}
