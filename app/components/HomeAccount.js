"use client";
import { useEffect, useState } from "react";
import { fetchProfile } from "../lib/browser-profile";

export default function HomeAccount() {
  const [profile, setProfile] = useState(undefined);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [failedAvatar, setFailedAvatar] = useState("");
  useEffect(() => {
    let disposed = false, running = false;
    const controller = new AbortController();
    async function check() {
      if (running || document.visibilityState === "hidden") return;
      running = true;
      try {
        const next = await fetchProfile(controller.signal);
        if (!disposed) { setProfile(next); setError(false); }
      } catch { if (!disposed) setError(true); }
      finally { running = false; }
    }
    check();
    window.addEventListener("focus", check);
    window.addEventListener("pageshow", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      disposed = true; controller.abort();
      window.removeEventListener("focus", check);
      window.removeEventListener("pageshow", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [retry]);
  return <div className="homeAccount">
    {profile ? <a className="profileLink" href="/account" aria-label={`Open account: ${profile.name}`} title={profile.name}>
      <span className="profilePhoto">{profile.avatar && failedAvatar !== profile.avatar ? <img src={profile.avatar} alt="" width="36" height="36" onError={() => setFailedAvatar(profile.avatar)}/> : <span aria-hidden="true">{Array.from(profile.name.trim())[0]?.toUpperCase() || "♡"}</span>}</span>
      <span className="profileName">{profile.name}</span>
    </a> : profile === null ? <><a className="guestLogin" href="/login">Log in</a><a className="guestSignup" href="/signup">Sign up</a></> : !error ? <span className="checking" role="status" aria-label="Checking your account"><span/> <span/></span> : <button className="retry" type="button" onClick={() => setRetry(v => v + 1)}>CHECK ACCOUNT ↻</button>}
    {error && profile !== undefined && <button className="retryIcon" type="button" onClick={() => setRetry(v => v + 1)} aria-label="Could not update account. Retry">↻</button>}
    <style jsx>{`
      .homeAccount { display: flex; align-items: center; gap: 16px; flex-shrink: 0; min-width: 0; }
      .profileLink { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; color: #692f3c; text-decoration: none; border: 1px solid #d9c6c2; border-radius: 30px; padding: 4px 16px 4px 4px; background: #fffaf5; }
      .profilePhoto { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; overflow: hidden; background: #ead3d2; flex-shrink: 0; font: 20px Georgia,serif; }
      .profilePhoto img { width: 100%; height: 100%; object-fit: cover; }
      .profileName { max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 600 12px Arial,sans-serif; }
      .guestLogin, .guestSignup { font: 600 12px Arial,sans-serif; text-decoration: none; color: #692f3c; min-height: 44px; display: inline-flex; align-items: center; }
      .guestSignup { padding: 0 18px; border-radius: 24px; background: #692f3c; color: #fffaf5; }
      .checking { display: inline-flex; align-items: center; gap: 10px; width: 120px; min-height: 44px; }
      .checking span:first-child { width: 36px; height: 36px; border-radius: 50%; background: #eadfd9; }
      .checking span:last-child { width: 60px; height: 10px; border-radius: 8px; background: #eadfd9; }
      .retry, .retryIcon { border: 0; background: transparent; color: #692f3c; font: 600 10px Arial,sans-serif; cursor: pointer; min-height: 44px; }
      a:focus-visible, button:focus-visible { outline: 2px solid #692f3c; outline-offset: 3px; }
      @media(max-width: 600px) { .homeAccount { gap: 10px; } .profileName { max-width: 88px; } .profileLink { padding-right: 12px; gap: 7px; } .guestSignup { padding: 0 12px; } }
    `}</style>
  </div>;
}
