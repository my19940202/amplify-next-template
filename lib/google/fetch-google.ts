import { fetch as undiciFetch, ProxyAgent } from "undici";

function getProxyUrl(): string | undefined {
  return (
    process.env.GOOGLE_MAPS_PROXY ??
    process.env.HTTPS_PROXY ??
    process.env.https_proxy ??
    undefined
  );
}

function formatFetchError(error: unknown): string {
  if (error instanceof Error) {
    const cause =
      error.cause instanceof Error
        ? error.cause.message
        : error.cause != null
          ? String(error.cause)
          : null;
    if (cause && cause !== error.message) {
      return `${error.message} (${cause})`;
    }
    return error.message;
  }
  return String(error);
}

/**
 * Server-side fetch for Google Maps REST APIs.
 * Supports HTTPS_PROXY / GOOGLE_MAPS_PROXY for regions where Google is blocked.
 */
export async function fetchGoogle(url: string): Promise<{ json: () => Promise<unknown> }> {
  const proxy = getProxyUrl();

  try {
    if (proxy) {
      const dispatcher = new ProxyAgent(proxy);
      return await undiciFetch(url, { dispatcher });
    }

    return fetch(url);
  } catch (error) {
    const detail = formatFetchError(error);
    throw new Error(
      `Google Maps API unreachable: ${detail}. ` +
        "Enable VPN on the machine running Next.js, or set GOOGLE_MAPS_PROXY / HTTPS_PROXY in .env.local."
    );
  }
}

export function isGoogleMapsMockEnabled(): boolean {
  return process.env.GOOGLE_MAPS_MOCK === "true";
}
