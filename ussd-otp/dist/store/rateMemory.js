export class MemoryRateLimiter {
    constructor() {
        this.map = new Map();
    }
    async incr(key, ttlSec) {
        const now = Date.now();
        const rec = this.map.get(key);
        if (!rec || rec.expiresAt < now) {
            const next = { count: 1, expiresAt: now + ttlSec * 1000 };
            this.map.set(key, next);
            return 1;
        }
        rec.count += 1;
        return rec.count;
    }
    async ttl(key) {
        const rec = this.map.get(key);
        if (!rec)
            return -2;
        const ms = rec.expiresAt - Date.now();
        return ms > 0 ? Math.ceil(ms / 1000) : -2;
    }
}
