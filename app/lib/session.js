import { cookies } from "next/headers";

export class SessionError extends Error {
  constructor(message, status = 401) { super(message); this.status = status; }
}
export function setSessionCookies(store, data) {
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" };
  store.set("wiveli_access_token", data.access_token, {...options, maxAge: data.expires_in || 3600});
  store.set("wiveli_refresh_token", data.refresh_token, {...options, maxAge: 60 * 60 * 24 * 30});
}
const refreshing = new Map();
export async function requireSession() {
  const store = await cookies();
  const accessToken = store.get("wiveli_access_token")?.value;
  const refreshToken = store.get("wiveli_refresh_token")?.value;
  const url = process.env.SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new SessionError("Authentication is not configured.", 500);
  if (accessToken) {
    const response = await fetch(`${url}/auth/v1/user`, {headers: {apikey: key, Authorization: `Bearer ${accessToken}`}, cache: "no-store"});
    if (response.ok) { const user = await response.json(); if (user.id) return {user, accessToken}; }
    else if (response.status !== 401 && response.status !== 403) throw new SessionError("Could not verify your session. Please try again.", 503);
  }
  if (!refreshToken) throw new SessionError("Please sign in again to continue.");
  // Share a token rotation between concurrent requests on this server instance.
  let pending = refreshing.get(refreshToken);
  if (!pending) {
    pending = (async () => {
      const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST", headers: {apikey: key, "Content-Type": "application/json"},
        body: JSON.stringify({refresh_token: refreshToken}), cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok || !data.user?.id || !data.access_token || !data.refresh_token) throw new SessionError(response.status >= 500 ? "Sign in is temporarily unavailable. Please try again." : "Your session expired. Please sign in again.", response.status >= 500 ? 503 : 401);
      return data;
    })();
    refreshing.set(refreshToken, pending);
  }
  try { const data = await pending; setSessionCookies(store, data); return {user: data.user, accessToken: data.access_token}; }
  finally { if (refreshing.get(refreshToken) === pending) refreshing.delete(refreshToken); }
}
export function publicProfile(user) {
  return {name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "WIVELI", email: user.email || "", avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || ""};
}
