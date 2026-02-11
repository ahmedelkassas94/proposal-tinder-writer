type Bucket = {
  count: number;
  windowStart: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 60;

const buckets = new Map<string, Bucket>();

export function basicRateLimit(ip: string | null | undefined): boolean {
  const key = ip || "unknown";
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (now - bucket.windowStart > WINDOW_MS) {
    bucket.count = 1;
    bucket.windowStart = now;
    return true;
  }

  if (bucket.count >= MAX_REQUESTS) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function getRequestIp(headers: Headers): string | null {
  return (
    headers.get("x-forwarded-for") ||
    headers.get("x-real-ip") ||
    null
  );
}

