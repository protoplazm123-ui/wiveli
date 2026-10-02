"use client";
import { useCallback, useEffect, useState } from "react";
import TelegramConnect from "../components/TelegramConnect";
export default function Onboarding() {
  const [connected, setConnected] = useState(false);
  const [next, setNext] = useState("/account");
  const onConnected = useCallback(() => setConnected(true), []);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("next");
    if (value?.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !value.startsWith("/onboarding")) setNext(value);
  }, []);
  return <main><a href="/">WI♥ELI</a><p>FINISH SETTING UP YOUR ACCOUNT</p><h1>Your gifts.<br/><em>Your updates.</em></h1><p>Connect your Telegram account to receive notifications from the WIVELI bot. Your gift history and updates will also be available in your account.</p><TelegramConnect onConnected={onConnected}/>{connected && <a className="continue" href={next}>CONTINUE →</a>}<style jsx>{`
    main { box-sizing: border-box; min-height: 100svh; padding: 40px max(20px, calc((100vw - 640px)/2)); background: #f7f0e8; color: #692f3c; font-family: Arial, sans-serif; }
    h1 { font: clamp(40px,8vw,64px)/1 Georgia,serif; } p { line-height: 1.6; } a { color: inherit; } .continue { display: inline-block; padding: 18px 25px; background: #692f3c; color: white; border-radius: 30px; text-decoration: none; }
  `}</style></main>;
}
