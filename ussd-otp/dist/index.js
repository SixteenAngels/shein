import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { parsePhoneNumber } from 'libphonenumber-js';
import { createOtpSender } from './otp/sender';
import { MemorySessionStore } from './store/memory';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
const limiter = rateLimit({ windowMs: 60000, max: 60 });
app.use('/ussd', limiter);
const store = new MemorySessionStore({ ttlMs: 5 * 60000 });
const otpSender = createOtpSender();
const UssdSchema = z.object({
    // Africa's Talking style defaults; adjust per aggregator
    sessionId: z.string(),
    phoneNumber: z.string(),
    serviceCode: z.string().optional(),
    text: z.string().optional().default(''),
    networkCode: z.string().optional(),
});
function toE164(phoneNumber) {
    try {
        const defaultRegion = process.env.DEFAULT_REGION || 'GH';
        const p = parsePhoneNumber(phoneNumber, { defaultCountry: defaultRegion });
        return p ? p.number.toString() : phoneNumber;
    }
    catch {
        return phoneNumber;
    }
}
function genOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function ussdResponse(text, end = false) {
    return `${end ? 'END' : 'CON'} ${text}`;
}
app.post('/ussd', async (req, res) => {
    const parsed = UssdSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.type('text/plain').send(ussdResponse('Invalid request', true));
    }
    const { sessionId, phoneNumber, text } = parsed.data;
    const phoneE164 = toE164(phoneNumber);
    let session = (await store.get(sessionId)) ?? {
        state: 'INIT',
        phoneE164,
        attempts: 0,
    };
    const parts = text.split('*').filter(Boolean);
    // INIT: show welcome and trigger OTP send
    if (session.state === 'INIT') {
        const otp = genOtp();
        session.otp = otp;
        session.state = 'WAITING_OTP';
        session.attempts = 0;
        await store.set(sessionId, session);
        const channel = process.env.OTP_CHANNEL || 'sms';
        await otpSender.send({ to: phoneE164, otp, channel });
        return res.type('text/plain').send(ussdResponse('Welcome to Ihsan. We sent you a 6-digit OTP.\nEnter OTP:'));
    }
    // WAITING_OTP: validate entered code
    if (session.state === 'WAITING_OTP') {
        const input = parts.at(-1) ?? '';
        if (!/^\d{6}$/.test(input)) {
            return res.type('text/plain').send(ussdResponse('Invalid OTP. Enter 6 digits:'));
        }
        if (session.otp !== input) {
            session.attempts += 1;
            await store.set(sessionId, session);
            if (session.attempts >= 3) {
                await store.delete(sessionId);
                return res.type('text/plain').send(ussdResponse('Too many attempts. Try later.', true));
            }
            return res.type('text/plain').send(ussdResponse('Incorrect OTP. Try again:'));
        }
        session.state = 'AUTHENTICATED';
        await store.set(sessionId, session);
        return res.type('text/plain').send(ussdResponse('Authenticated!\n1. Continue to app\n0. Exit'));
    }
    // AUTHENTICATED: allow access menu
    if (session.state === 'AUTHENTICATED') {
        const input = parts.at(-1) ?? '';
        if (input === '1') {
            return res.type('text/plain').send(ussdResponse('Access granted. Visit app link sent via SMS.', true));
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
