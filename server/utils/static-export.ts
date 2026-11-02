import { timingSafeEqual } from 'node:crypto';

// Shared helpers for /api/export/* (client-triggered static export via GitHub Actions).
// Env: EXPORT_PASSWORD, GITHUB_EXPORT_TOKEN, GITHUB_EXPORT_REPO (owner/repo), EXPORT_GIT_REF (default: main)

export const EXPORT_WORKFLOW = 'static-export.yml';

export const requireExportAuth = (event: Parameters<typeof getRequestHeader>[0]) => {
	const expected = process.env.EXPORT_PASSWORD;
	if (!expected) {
		throw createError({ statusCode: 503, statusMessage: 'Export not configured' });
	}
	const given = Buffer.from(getRequestHeader(event, 'x-export-password') || '');
	const wanted = Buffer.from(expected);
	if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
		throw createError({ statusCode: 401, statusMessage: 'Wrong password' });
	}
};

const githubConfig = () => {
	const token = process.env.GITHUB_EXPORT_TOKEN;
	const repo = process.env.GITHUB_EXPORT_REPO;
	if (!token || !repo) {
		throw createError({ statusCode: 503, statusMessage: 'GitHub export not configured' });
	}
	return {
		repo,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'input-idea-static-export',
		},
	};
};

const GITHUB_HINTS: Record<number, string> = {
	401: 'token non valido o scaduto (GITHUB_EXPORT_TOKEN)',
	403: 'il token non ha i permessi Actions read/write su questo repo',
	404: 'repo non trovato o workflow static-export.yml non presente sul branch principale',
	422: 'branch EXPORT_GIT_REF non valido o workflow senza workflow_dispatch',
};

export const githubApi = async <T = any>(path: string, options: { method?: 'GET' | 'POST'; body?: any } = {}) => {
	const { repo, headers } = githubConfig();
	try {
		return await $fetch<T>(`https://api.github.com/repos/${repo}${path}`, { ...options, headers });
	} catch (e: any) {
		// never forward GitHub's status as-is (a GitHub 401 would look like a wrong export password)
		const status = e?.response?.status ?? e?.statusCode;
		console.error('[static-export] GitHub API error', status, path, e?.data?.message);
		throw createError({
			statusCode: 502,
			statusMessage: `GitHub ${status ?? '?'}: ${GITHUB_HINTS[status] ?? e?.data?.message ?? 'errore sconosciuto'}`,
		});
	}
};

// Artifact downloads answer with a 302 to a short-lived signed URL that needs no auth
export const githubArtifactUrl = async (artifactId: number) => {
	const { repo, headers } = githubConfig();
	const res = await fetch(`https://api.github.com/repos/${repo}/actions/artifacts/${artifactId}/zip`, {
		headers,
		redirect: 'manual',
	});
	const url = res.headers.get('location');
	if (!url) throw createError({ statusCode: 502, statusMessage: `GitHub download failed (${res.status})` });
	return url;
};
