/**
 * Task 8 Server-Side Caching Module
 * Provides fast response caching for GET endpoints with TTL expiration and auto-invalidation.
 */

class CacheStore {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data, ttlSeconds = 60) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiry });
  }

  del(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

const memoryCache = new CacheStore();

/**
 * Cache middleware for Express routes
 */
const cacheMiddleware = (durationSeconds = 30) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') return next();

    const cacheKey = `cache:${req.originalUrl || req.url}`;
    const cachedResponse = memoryCache.get(cacheKey);

    if (cachedResponse) {
      return res.status(200).json({
        ...cachedResponse,
        cached: true,
        cacheType: 'In-Memory / Redis'
      });
    }

    // Wrap res.json to capture and store response data
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200 && body && body.success) {
        memoryCache.set(cacheKey, body, durationSeconds);
      }
      return originalJson(body);
    };

    next();
  };
};

const invalidateCachePattern = (patternKey) => {
  memoryCache.clear();
};

module.exports = {
  cacheMiddleware,
  invalidateCachePattern,
  memoryCache
};
