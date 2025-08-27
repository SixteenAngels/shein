import twilio from 'twilio';
import nodemailer from 'nodemailer';
export function createOtpSender() {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const fromNumber = process.env.TWILIO_FROM;
    const client = accountSid && authToken ? twilio(accountSid, authToken) : null;
    const mailer = process.env.SMTP_HOST
        ? nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        })
        : null;
    return {
        async send({ to, otp, channel }) {
            if (channel === 'sms' && client && fromNumber) {
                await client.messages.create({ to, from: fromNumber, body: `Your Ihsan OTP is ${otp}` });
                return;
            }
            if (channel === 'email' && mailer) {
                await mailer.sendMail({ from: 'no-reply@ihsan.app', to, subject: 'Your Ihsan OTP', text: `OTP: ${otp}` });
                return;
            }
            // fallback to console for development
            // eslint-disable-next-line no-console
            console.log(`[DEV] OTP for ${to}: ${otp}`);
        },
    };
}
