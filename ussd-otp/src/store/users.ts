import Redis from 'ioredis';

export class VerifiedUserRepo {
	private readonly redis: Redis;

	constructor(url?: string) {
		this.redis = new Redis(url || process.env.REDIS_URL || 'redis://localhost:6379');
	}

	async isVerified(phoneE164: string): Promise<boolean> {
		return (await this.redis.sismember('verified:users', phoneE164)) === 1;
	}

	async add(phoneE164: string) {
		await this.redis.sadd('verified:users', phoneE164);
	}
}