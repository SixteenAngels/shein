export class MemorySessionStore {
    constructor(opts) {
        this.map = new Map();
        this.ttlMs = opts.ttlMs;
        this.cleanupTimer = setInterval(() => this.cleanup(), Math.min(60000, this.ttlMs));
    }
    async get(key) {
        const e = this.map.get(key);
        if (!e)
            return undefined;
        if (e.expiresAt < Date.now()) {
            this.map.delete(key);
            return undefined;
        }
        return e.value;
    }
    async set(key, value) {
        this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    }
    async delete(key) {
        this.map.delete(key);
    }
    cleanup() {
        const now = Date.now();
        for (const [k, v] of this.map.entries()) {
            if (v.expiresAt < now)
                this.map.delete(k);
        }
    }
}
