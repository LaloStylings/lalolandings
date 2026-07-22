// Safe dataLayer push. Never throws, even when window.dataLayer is missing
// (e.g. GTM blocked by an adblocker or privacy setting), so analytics can never
// break the app. Events pushed before GTM loads are queued on the array and
// picked up once (if) the container initialises.
export function pushToDataLayer(event) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  } catch {
    /* swallow: tracking must never surface an error to the user */
  }
}
