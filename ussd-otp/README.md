# USSD OTP Authentication Service

A minimal USSD backend (Express + TypeScript) that sends OTPs to the user's phone and blocks access to the app menu until the OTP is verified.

## Features

- Africa's Talking–style USSD webhook (`POST /ussd`)
- OTP generation and validation (6 digits)
- SMS via Twilio, Email via SMTP, or console fallback
- In-memory session store with TTL and rate limiting

## Setup

```bash
cd ussd-otp
cp .env.example .env
# Fill in TWILIO_* or SMTP_* creds in .env
npm install
npm run build
npm start
```

- Expose the service publicly (e.g., with `ngrok http 3000`).
- Configure your USSD provider (Africa's Talking, MTN, Vodafone) to forward requests to `POST https://<your-domain>/ussd`.

## USSD Flow

1. User dials your USSD code (e.g., *123#)
2. Service sends a 6-digit OTP via SMS/Email
3. User enters the OTP in the USSD session
4. If correct: user sees "Continue"; otherwise, retry up to 3 times

## Environment

- `DEFAULT_REGION` (e.g., GH)
- `OTP_CHANNEL` sms | email | console
- Twilio: `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## Notes

- Replace the in-memory store with Redis for production.
- Add a persistent user store if you need to bind verified state to a user profile.