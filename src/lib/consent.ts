export const STORAGE_KEY = "familj_cookie_consent";
export const CONSENT_ALL = "all";
export const CONSENT_NECESSARY = "necessary";

export function getConsent(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setConsent(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage unavailable
  }
}

export function hasAcceptedAll(): boolean {
  return getConsent() === CONSENT_ALL;
}
