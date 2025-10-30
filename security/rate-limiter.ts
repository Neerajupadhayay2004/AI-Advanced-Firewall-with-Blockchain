interface RateLimitConfig {
  windowMs: number
  max: number
  keyGenerator: (ip: string, identifier?: string) => string
}

interface RateLimitResult {
  success: boolean
  attempts: number
  resetTime: number
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return async (ip: string, identifier?: string): Promise<RateLimitResult> => {
    const key = config.keyGenerator(ip, identifier)
    const now = Date.now()

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }

    const existing = rateLimitStore.get(key)

    if (!existing) {
      // First request
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      })
      return {
        success: true,
        attempts: 1,
        resetTime: now + config.windowMs,
      }
    }

    if (existing.resetTime < now) {
      // Window expired, reset
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      })
      return {
        success: true,
        attempts: 1,
        resetTime: now + config.windowMs,
      }
    }

    // Within window
    existing.count++

    return {
      success: existing.count <= config.max,
      attempts: existing.count,
      resetTime: existing.resetTime,
    }
  }
}

// DDoS protection rate limiter
export const ddosProtection = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  keyGenerator: (ip: string) => `ddos:${ip}`,
})

// API rate limiter
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 minutes per IP
  keyGenerator: (ip: string) => `api:${ip}`,
})
