export interface LicenseState {
  unlocked: boolean;
  checking: boolean;
  notice: string;
}

const PRODUCT_SLUG = import.meta.env.VITE_PRODUCT_SLUG || "backfill-timecards";
const BILLING_BASE = import.meta.env.VITE_BILLING_BASE || "https://api.sociobot.in";
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const DAY = 86_400_000;

interface CachedVerdict {
  valid: boolean;
  checkedAt: number;
}

export const checkoutUrl = `${BILLING_BASE}/api/v1/products/${PRODUCT_SLUG}/checkout`;

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get("license");
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 }));
  url.searchParams.delete("license");
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

export function initialLicenseState(): LicenseState {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { unlocked: false, checking: false, notice: "" };
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || "null") as CachedVerdict | null;
    return { unlocked: cached?.valid ?? true, checking: false, notice: "" };
  } catch {
    return { unlocked: true, checking: false, notice: "" };
  }
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { unlocked: false, checking: false, notice: "" };
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || "null") as CachedVerdict | null;
    if (!force && cached && Date.now() - cached.checkedAt < DAY) {
      return { unlocked: cached.valid, checking: false, notice: cached.valid ? "" : "License no longer active." };
    }
  } catch { /* verify below */ }

  try {
    const response = await fetch(`${BILLING_BASE}/api/v1/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error("Verification unavailable");
    const result = (await response.json()) as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return { unlocked: result.valid, checking: false, notice: result.valid ? "Pattern deck unlocked." : "License no longer active." };
  } catch {
    return { ...initialLicenseState(), checking: false, notice: "Could not recheck the license. Your last verified access is unchanged." };
  }
}

export function saveLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}
