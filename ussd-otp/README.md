# USSD OTP Authentication Service

A minimal USSD backend (Express + TypeScript) that sends OTPs to the user's phone and blocks access to the app menu until the OTP is verified.

## Features

- Africa's Talking–style USSD webhook (`POST /ussd`)
- OTP generation and validation (6 digits) with resend (press 9)
- SMS via Twilio, Email via SMTP, or console fallback
- Redis-backed sessions and verified user persistence
- Rate limiting

## Setup

```bash
cd ussd-otp
cp .env.example .env
# Set REDIS_URL and TWILIO_*/SMTP_* credentials
npm install
npm run build
npm start
```

- Expose the service publicly (e.g., with `ngrok http 3000`).
- Configure your USSD provider (Africa's Talking, MTN, Vodafone) to forward requests to `POST https://<your-domain>/ussd`.

## USSD Flow

1. User dials your USSD code (e.g., *123#)
2. Service sends a 6-digit OTP via SMS/Email
3. User enters the OTP in the USSD session (or presses 9 to resend)
4. If correct: user is marked verified in Redis and sees "Continue" menu
5. On subsequent sessions: verified users skip OTP and land on menu immediately

## Environment

- `DEFAULT_REGION` (e.g., GH)
- `OTP_CHANNEL` sms | email | console
- `REDIS_URL` redis://...
- Twilio: `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## Notes

- For production, deploy behind HTTPS and secure your aggregator IPs.
- Extend verified persistence to a database if you need more user attributes.