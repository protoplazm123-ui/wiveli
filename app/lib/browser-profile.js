export async function fetchProfile(signal) {
  const response = await fetch("/api/auth/me", {credentials: "same-origin", cache: "no-store", signal});
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Could not check your account. Please try again.");
  const data = await response.json();
  if (!data.authenticated || !data.id) throw new Error("Could not verify your account.");
  return {id: data.id, name: data.name || "My account", avatar: data.avatar || ""};
}
