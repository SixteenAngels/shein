import Redis from 'ioredis';

export class RateLimiter {
	private readonly redis: Redis;

	constructor(url?: string) {
		this.redis = new Redis(url || process.env.REDIS_URL || 'redis://localhost:6379');
	}

	// Increment a counter with TTL, returns new count
	async incr(key: string, ttlSec: number): Promise<number> {
		const multi = this.redis.multi();
		multi.incr(key);
		multi.expire(key, ttlSec, 'NX');
		const res = await multi.exec();
		const count = (res?.[0]?.[1] as number) || 0;
		return count;
	}

	async ttl(key: string): Promise<number> {
		return this.redis.ttl(key);
	}
}