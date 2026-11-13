export const SESSION_KEY_AUTH = 'WellyandCarey_owner_session';
export const SESSION_KEY_LAST_ACTIVE = 'WellyandCarey_owner_last_active';
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
export const KHR_EXCHANGE_RATE = 4100;
export const TELEGRAM_USERNAME = 'linnaboth';

// EDIT YOUR MASTER ADMIN PASSWORD HERE IN CODE:
export const ADMIN_MASTER_PASSWORD = "wellycarey2026";

export function formatRiel(usd) {
  if (usd <= 0) return '';
  const riel = Math.round(usd * KHR_EXCHANGE_RATE);
  return riel.toLocaleString('en-US') + ' ៛';
}
