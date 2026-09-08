const requests = new Map<string, number[]>();
const MAX_REQUESTS = 15; // per minute per IP
const WINDOW = 60_000;   // 1 minute

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requests.get(ip) || [];

  // Clean old entries
  const recent = timestamps.filter(t => now - t < WINDOW);

  if (recent.length >= MAX_REQUESTS) {
    requests.set(ip, recent);
    return true;
  }

  recent.push(now);
  requests.set(ip, recent);

  // Cleanup old IPs every 100 entries
  if (requests.size > 1000) {
    for (const [key, vals] of requests) {
      if (vals.every(t => now - t > WINDOW)) requests.delete(key);
    }
  }

  return false;
}

export function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}
