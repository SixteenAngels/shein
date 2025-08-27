export async function sendOtp(phone: string) {
  const base = process.env.EXPO_PUBLIC_OTP_API_BASE as string;
  const res = await fetch(`${base}/api/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) throw new Error('send failed');
  return res.json();
}

export async function verifyOtp(phone: string, code: string) {
  const base = process.env.EXPO_PUBLIC_OTP_API_BASE as string;
  const res = await fetch(`${base}/api/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  });
  if (!res.ok) throw new Error('verify failed');
  return res.json();
}

