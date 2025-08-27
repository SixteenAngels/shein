export class MemoryVerifiedUserRepo {
    constructor() {
        this.set = new Set();
    }
    async isVerified(phoneE164) { return this.set.has(phoneE164); }
    async add(phoneE164) { this.set.add(phoneE164); }
}
