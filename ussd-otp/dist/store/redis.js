import Redis from 'ioredis';
export class RedisSessionStore {
    constructor(opts) {
        this.redis = new Redis(opts.url || process.env.REDIS_URL || 'redis://localhost:6379');
        this.ttlSec = Math.ceil(opts.ttlMs / 1000);
    }
    async get(key) {
        const raw = await this.redis.get(this.key(key));
        return raw ? JSON.parse(raw) : undefined;
    }
    async set(key, value) {
        await this.redis.set(this.key(key), JSON.stringify(value), 'EX', this.ttlSec);
    }
    async delete(key) {
        await this.redis.del(this.key(key));
    }
    key(k) {
        return `sess:${k}`;
    }
}
