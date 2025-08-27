import Redis from 'ioredis';
export class VerifiedUserRepo {
    constructor(url) {
        this.redis = new Redis(url || process.env.REDIS_URL || 'redis://localhost:6379');
    }
    async isVerified(phoneE164) {
        return (await this.redis.sismember('verified:users', phoneE164)) === 1;
    }
    async add(phoneE164) {
        await this.redis.sadd('verified:users', phoneE164);
    }
}
