export const STORAGE_KEY_PRODUCTS = 'WellyandCarey_skincare_data_v4';
export const STORAGE_KEY_HASH = 'WellyandCarey_owner_hash_sha256';
export const SESSION_KEY_AUTH = 'WellyandCarey_owner_session';
export const SESSION_KEY_LAST_ACTIVE = 'WellyandCarey_owner_last_active';
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_SEC = 60;
export const KHR_EXCHANGE_RATE = 4100;
export const TELEGRAM_USERNAME = 'linnaboth';

export async function hashStringSHA256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function formatRiel(usd) {
  if (usd <= 0) return '';
  const riel = Math.round(usd * KHR_EXCHANGE_RATE);
  return riel.toLocaleString('en-US') + ' ៛';
}

