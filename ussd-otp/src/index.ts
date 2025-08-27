import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { parsePhoneNumber } from 'libphonenumber-js';
import { createOtpSender } from './otp/sender';
import { RedisSessionStore } from './store/redis';
import { VerifiedUserRepo } from './store/users';
import { RateLimiter } from './store/rate';
import { ipAllowlist } from './middleware/ipAllowlist';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(hpp());
app.use('/ussd', ipAllowlist());

const limiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use('/ussd', limiter);

const store = new RedisSessionStore({ ttlMs: 5 * 60_000 });
const users = new VerifiedUserRepo();
const otpSender = createOtpSender();
const rate = new RateLimiter();

const UssdSchema = z.object({
	// Africa's Talking style defaults; adjust per aggregator
	sessionId: z.string(),
	phoneNumber: z.string(),
	serviceCode: z.string().optional(),
	text: z.string().optional().default(''),
	networkCode: z.string().optional(),
});

type Session = {
	state: 'INIT' | 'WAITING_OTP' | 'AUTHENTICATED';
	phoneE164: string;
	otp?: string;
	attempts: number;
};

function toE164(phoneNumber: string) {
	try {
		const defaultRegion = (process.env.DEFAULT_REGION as any) || 'GH';
		const p = parsePhoneNumber(phoneNumber, { defaultCountry: defaultRegion });
		return p ? p.number.toString() : phoneNumber;
	} catch {
		return phoneNumber;
	}
}

function genOtp() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

function ussdResponse(text: string, end = false) {
	return `${end ? 'END' : 'CON'} ${text}`;
}

const DAILY_LIMIT = Number(process.env.OTP_DAILY_LIMIT || 5);
const RESEND_HOURLY_LIMIT = Number(process.env.OTP_RESEND_HOURLY_LIMIT || 3);
const RESEND_COOLDOWN_SEC = Number(process.env.OTP_RESEND_COOLDOWN_SEC || 60);

app.post('/ussd', async (req, res) => {
	// Optional secret check and IP allowlist
	const secret = process.env.USSD_SHARED_SECRET;
	if (secret && req.headers['x-ussd-secret'] !== secret) {
		return res.type('text/plain').send(ussdResponse('Unauthorized', true));
	}
	const parsed = UssdSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.type('text/plain').send(ussdResponse('Invalid request', true));
	}
	const { sessionId, phoneNumber, text } = parsed.data;
	const phoneE164 = toE164(phoneNumber);

	let session = (await store.get<Session>(sessionId)) ?? {
		state: 'INIT',
		phoneE164,
		attempts: 0,
	};

	const parts = text.split('*').filter(Boolean);

	// If user is already verified, skip OTP and enter authenticated menu immediately
	if (session.state === 'INIT') {
		if (await users.isVerified(phoneE164)) {
			session.state = 'AUTHENTICATED';
			await store.set(sessionId, session);
			return res.type('text/plain').send(
				ussdResponse('Welcome back!\n1. Continue to app\n0. Exit')
			);
		}
	}

	// INIT: show welcome and trigger OTP send (with daily limit)
	if (session.state === 'INIT') {
		const dailyKey = `otp:daily:${phoneE164}`;
		const count = await rate.incr(dailyKey, 24 * 3600);
		if (count > DAILY_LIMIT) {
			const ttl = await rate.ttl(dailyKey);
			return res.type('text/plain').send(
				ussdResponse(`Daily OTP limit reached. Try again in ${Math.ceil(ttl / 3600)}h`, true)
			);
		}

		const otp = genOtp();
		session.otp = otp;
		session.state = 'WAITING_OTP';
		session.attempts = 0;
		await store.set(sessionId, session);
		const channel = (process.env.OTP_CHANNEL as 'sms' | 'email' | 'console') || 'sms';
		await otpSender.send({ to: phoneE164, otp, channel });
		// start a short resend cooldown
		await rate.incr(`otp:cooldown:${phoneE164}`, RESEND_COOLDOWN_SEC);
		return res.type('text/plain').send(
			ussdResponse('Welcome to Ihsan. We sent you a 6-digit OTP.\nEnter OTP or 9 to resend:')
		);
	}

	// WAITING_OTP: validate entered code (or resend)
	if (session.state === 'WAITING_OTP') {
		const input = parts.at(-1) ?? '';
		if (input === '9') {
			// enforce cooldown and hourly resend cap
			const cdTtl = await rate.ttl(`otp:cooldown:${phoneE164}`);
			if (cdTtl > 0) {
				return res.type('text/plain').send(ussdResponse(`Please wait ${cdTtl}s before resending.`));
			}
			const resendKey = `otp:resend:${phoneE164}`;
			const rc = await rate.incr(resendKey, 3600);
			if (rc > RESEND_HOURLY_LIMIT) {
				const ttl = await rate.ttl(resendKey);
				return res.type('text/plain').send(ussdResponse(`Resend limit reached. Try in ${ttl} seconds.`));
			}
			const otp = genOtp();
			session.otp = otp;
			session.attempts = 0;
			await store.set(sessionId, session);
			const channel = (process.env.OTP_CHANNEL as 'sms' | 'email' | 'console') || 'sms';
			await otpSender.send({ to: phoneE164, otp, channel });
			await rate.incr(`otp:cooldown:${phoneE164}`, RESEND_COOLDOWN_SEC);
			return res.type('text/plain').send(ussdResponse('OTP resent. Enter 6-digit code:'));
		}
		if (!/^\d{6}$/.test(input)) {
			return res.type('text/plain').send(ussdResponse('Invalid OTP. Enter 6 digits or 9 to resend:'));
		}
		if (session.otp !== input) {
			session.attempts += 1;
			await store.set(sessionId, session);
			if (session.attempts >= 3) {
				await store.delete(sessionId);
				return res.type('text/plain').send(ussdResponse('Too many attempts. Try later.', true));
			}
			return res.type('text/plain').send(ussdResponse('Incorrect OTP. Try again or press 9 to resend:'));
		}
		session.state = 'AUTHENTICATED';
		await users.add(phoneE164);
		await store.set(sessionId, session);
		return res.type('text/plain').send(
			ussdResponse('Authenticated!\n1. Continue to app\n0. Exit')
		);
	}

	// AUTHENTICATED: allow access menu
	if (session.state === 'AUTHENTICATED') {
		const input = parts.at(-1) ?? '';
		if (input === '1') {
			return res.type('text/plain').send(
				ussdResponse('Access granted. Visit app link sent via SMS.', true)
			);
		}
		if (input === '0') {
			await store.delete(sessionId);
			return res.type('text/plain').send(ussdResponse('Goodbye.', true));
		}
		return res.type('text/plain').send(ussdResponse('1. Continue\n0. Exit'));
	}

	return res.type('text/plain').send(ussdResponse('Session error', true));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`USSD OTP service listening on :${port}`));