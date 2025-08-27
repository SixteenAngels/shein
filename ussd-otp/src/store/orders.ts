import Redis from 'ioredis';

export type Order = {
  reference: string;
  email?: string;
  amount?: number;
  status: 'initiated' | 'pending' | 'payment_confirmed' | 'processing' | 'failed' | 'cancelled';
};

export class OrderRepo {
  private readonly redis: Redis;

  constructor(url?: string) {
    this.redis = new Redis(url || process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async create(order: Order) {
    const key = this.key(order.reference);
    await this.redis.hset(key, {
      reference: order.reference,
      email: order.email || '',
      amount: String(order.amount || 0),
      status: order.status,
    });
  }

  async setStatus(reference: string, status: Order['status']) {
    await this.redis.hset(this.key(reference), { status });
  }

  async get(reference: string): Promise<Order | null> {
    const data = await this.redis.hgetall(this.key(reference));
    if (!data || Object.keys(data).length === 0) return null;
    return {
      reference: data.reference,
      email: data.email || undefined,
      amount: data.amount ? Number(data.amount) : undefined,
      status: (data.status as Order['status']) || 'pending',
    };
  }

  private key(ref: string) {
    return `order:${ref}`;
  }
}

