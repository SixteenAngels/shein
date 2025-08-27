import crypto from 'crypto';

export function verifySignature(rawBody: Buffer, signature: string | string[] | undefined): boolean {
	const secret = process.env.PAYSTACK_SECRET_KEY || '';
	if (!secret || !signature) return false;
	const computed = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
	const sig = Array.isArray(signature) ? signature[0] : signature;
	return computed === sig;
}

export async function verifyTransaction(reference: string) {
	const secret = process.env.PAYSTACK_SECRET_KEY || '';
	const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
		headers: {
			Authorization: `Bearer ${secret}`,
			Accept: 'application/json',
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Paystack verify failed: ${res.status} ${text}`);
	}
	return res.json();
}

export async function refund(reference: string) {
	const secret = process.env.PAYSTACK_SECRET_KEY || '';
	const res = await fetch(`https://api.paystack.co/refund`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${secret}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ reference }),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Paystack refund failed: ${res.status} ${text}`);
	}
	return res.json();
}

