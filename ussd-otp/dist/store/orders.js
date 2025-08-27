import Redis from 'ioredis';
export class OrderRepo {
    constructor(url) {
        this.redis = new Redis(url || process.env.REDIS_URL || 'redis://localhost:6379');
    }
    async create(order) {
        const key = this.key(order.reference);
        await this.redis.hset(key, {
            reference: order.reference,
            email: order.email || '',
            amount: String(order.amount || 0),
            status: order.status,
        });
    }
    async setStatus(reference, status) {
        await this.redis.hset(this.key(reference), { status });
    }
    async get(reference) {
        const data = await this.redis.hgetall(this.key(reference));
        if (!data || Object.keys(data).length === 0)
            return null;
        return {
            reference: data.reference,
            email: data.email || undefined,
            amount: data.amount ? Number(data.amount) : undefined,
            status: data.status || 'pending',
        };
    }
    key(ref) {
        return `order:${ref}`;
    }
}
