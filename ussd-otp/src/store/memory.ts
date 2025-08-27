type Entry = { value: any; expiresAt: number };

export class MemorySessionStore {
  private readonly ttlMs: number;
  private readonly map = new Map<string, Entry>();
  private cleanupTimer?: NodeJS.Timeout;

  constructor(opts: { ttlMs: number }) {
    this.ttlMs = opts.ttlMs;
    this.cleanupTimer = setInterval(() => this.cleanup(), Math.min(60_000, this.ttlMs));
  }

  async get<T>(key: string): Promise<T | undefined> {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (e.expiresAt < Date.now()) {
      this.map.delete(key);
      return undefined;
    }
    return e.value as T;
  }

  async set(key: string, value: any) {
    this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  async delete(key: string) {
    this.map.delete(key);
  }

  private cleanup() {
    const now = Date.now();
    for (const [k, v] of this.map.entries()) {
      if (v.expiresAt < now) this.map.delete(k);
    }
  }
}

