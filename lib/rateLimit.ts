type RateLimitRecord = { count: number; resetAt: number };
const store = new Map<string, RateLimitRecord>();

export const checkRateLimit = (
  ip: string,
  maxRequests = 10,
  windowMs = 60_000
): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
};
