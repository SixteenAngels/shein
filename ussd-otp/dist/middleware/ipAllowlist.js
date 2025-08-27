export function ipAllowlist() {
    const list = (process.env.USSD_IP_ALLOWLIST || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    if (list.length === 0) {
        return (_req, _res, next) => next();
    }
    return (req, res, next) => {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '';
        if (list.includes(ip))
            return next();
        return res.type('text/plain').send('END Unauthorized');
    };
}
