const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const user = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  // If window has passed, reset counter
  if (now - user.lastReset > windowMs) {
    user.count = 0;
    user.lastReset = now;
  }

  if (user.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: Math.max(0, Math.ceil((user.lastReset + windowMs - now) / 1000)),
    };
  }

  user.count++;
  rateLimitMap.set(ip, user);

  return {
    success: true,
    remaining: limit - user.count,
    reset: Math.max(0, Math.ceil((user.lastReset + windowMs - now) / 1000)),
  };
}
