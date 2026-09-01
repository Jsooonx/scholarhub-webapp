const INTERNAL_URL_BASE = 'https://scholarhub.invalid';

/**
 * Accept only same-origin relative paths for post-authentication redirects.
 * Returning a normalized path also prevents protocol-relative and backslash
 * variants from being interpreted as external URLs by a browser.
 */
export function safeInternalPath(value: unknown, fallback = '/shortlist'): string {
  if (typeof value !== 'string') return fallback;

  const candidate = value.trim();
  if (
    !candidate ||
    candidate.length > 2048 ||
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.includes('\\') ||
    /[\u0000-\u001f\u007f]/.test(candidate)
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(candidate, INTERNAL_URL_BASE);
    if (parsed.origin !== INTERNAL_URL_BASE) return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
