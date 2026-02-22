import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

// This handles /storybook exactly (without trailing slash)
// The catch-all route [...].ts handles /storybook/*
export default defineEventHandler(async event => {
	const cwd = process.cwd();

	console.log('[Storybook Index] CWD:', cwd);

	const possibleDirs = [
		// Vercel paths
		join(cwd, '..', '..', 'static', 'storybook'),
		join(cwd, '..', 'static', 'storybook'),
		join('/var/task', 'storybook'),
		// Local development paths
		join(cwd, '.output', 'public', 'storybook'),
		join(cwd, 'public', 'storybook'),
	];

	console.log('[Storybook Index] Checking:', possibleDirs);

	for (const dir of possibleDirs) {
		const indexPath = join(dir, 'index.html');
		if (existsSync(indexPath)) {
			const indexHtml = await readFile(indexPath, 'utf-8');
			setHeader(event, 'Content-Type', 'text/html');
			return indexHtml;
		}
	}

	throw createError({
		statusCode: 404,
		message: 'Storybook not found',
	});
});
