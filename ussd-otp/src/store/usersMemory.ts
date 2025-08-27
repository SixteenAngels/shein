export class MemoryVerifiedUserRepo {
  private readonly set = new Set<string>();
  async isVerified(phoneE164: string): Promise<boolean> { return this.set.has(phoneE164); }
  async add(phoneE164: string) { this.set.add(phoneE164); }
}

