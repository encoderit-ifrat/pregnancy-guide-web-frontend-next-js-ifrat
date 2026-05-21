export const CONSENT_COOKIE = "familj-consent";
export const CONSENT_ACCEPTED = "accepted";
export const CONSENT_DECLINED = "declined";

export function getConsent(): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  return match ? match.split("=")[1] : null;
}

export function setConsent(value: string): void {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

export function hasAcceptedConsent(): boolean {
  return getConsent() === CONSENT_ACCEPTED;
}
