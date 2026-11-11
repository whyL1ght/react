// Cached data is considered fresh for 1 minute
const CACHE_TTL = 60 * 1000;
const cache = new Map();

// The promise is cached, so parallel requests with the same key share one call
export function getCached(key, load) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.promise;

  const promise = load();
  cache.set(key, { promise, time: Date.now() });
  // Do not keep failed requests in the cache
  promise.catch(() => cache.delete(key));
  return promise;
}

export function invalidate(key) {
  cache.delete(key);
}

export function invalidatePrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}
