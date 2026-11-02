import { timingSafeEqual } from 'node:crypto';

// Site-wide HTTP Basic auth, enforced on the server. Enabled only when SITE_PASSWORD is set.
const safeEqual = (a: string, b: string) => {
	const ab = Buffer.from(a);
	const bb = Buffer.from(b);
	return ab.length === bb.length && timingSafeEqual(ab, bb);
};

export default defineEventHandler((event) => {
	// never block the prerenderer (static export)
	if (import.meta.prerender) return;

	const { sitePassword } = useRuntimeConfig(event);
	if (!sitePassword) return;

	const header = getRequestHeader(event, 'authorization') || '';
	if (header.startsWith('Basic ')) {
		const decoded = Buffer.from(header.slice(6), 'base64').toString();
		const password = decoded.slice(decoded.indexOf(':') + 1);
		if (safeEqual(password, String(sitePassword))) return;
	}

	setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Restricted"');
	throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
});
