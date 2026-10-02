// Store only the explicitly supported recipient answers in gift_data.
export function normalizeRecipientResponse(value) {
  if (value == null) return {};
  if (typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid recipient details.");
  const result = {};
  for (const [key, limit] of Object.entries({choice: 200, date: 10, time: 5, place: 300, note: 2000})) {
    if (value[key] == null) continue;
    if (typeof value[key] !== "string" || value[key].length > limit) throw new Error(`Please check ${key}.`);
    const text = value[key].trim();
    if (text) result[key] = text;
  }
  if (result.date && (!/^\d{4}-\d{2}-\d{2}$/.test(result.date) || !Number.isFinite(Date.parse(result.date)) || new Date(result.date).toISOString().slice(0,10) !== result.date)) throw new Error("Please choose a valid date.");
  if (result.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(result.time)) throw new Error("Please choose a valid time.");
  return result;
}
