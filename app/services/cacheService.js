const config = require('../config');

class CacheService {
    constructor(ttlMs = config.cacheTtlMs) {
        this.store = new Map();
        this.ttlMs = ttlMs;
    }

    get(key) {
        const entry = this.store.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    set(key, value) {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + this.ttlMs,
        });
    }
}

module.exports = CacheService;
