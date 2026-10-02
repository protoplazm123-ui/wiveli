export async function attachmentStorage(path, body) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Attachment storage is not configured.");
  const response = await fetch(`${url}/storage/v1/${path}`, {method:"POST", headers:{apikey:key, Authorization:`Bearer ${key}`, "Content-Type":"application/json"}, body:JSON.stringify(body), cache:"no-store"});
  if (!response.ok) throw new Error("Could not access attachment storage. Please check the setup and try again.");
  return response.json();
}
export function storageUrl(relative) {
  if (typeof relative !== "string" || !relative.startsWith("/object/")) throw new Error("Invalid storage response.");
  return `${process.env.SUPABASE_URL}/storage/v1${relative}`;
}
