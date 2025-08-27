import Redis from 'ioredis';

export class RedisSessionStore {
	private readonly redis: Redis;
	private readonly ttlSec: number;

	constructor(opts: { url?: string; ttlMs: number }) {
		this.redis = new Redis(opts.url || process.env.REDIS_URL || 'redis://localhost:6379');
		this.ttlSec = Math.ceil(opts.ttlMs / 1000);
	}

	async get<T>(key: string): Promise<T | undefined> {
		const raw = await this.redis.get(this.key(key));
		return raw ? (JSON.parse(raw) as T) : undefined;
	}

	async set(key: string, value: any) {
		await this.redis.set(this.key(key), JSON.stringify(value), 'EX', this.ttlSec);
	}

	async delete(key: string) {
		await this.redis.del(this.key(key));
	}

	private key(k: string) {
		return `sess:${k}`;
	}
}