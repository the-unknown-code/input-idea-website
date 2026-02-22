import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

export default defineEventHandler(async event => {
	const url = event.node.req.url || '';
	console.log('[Storybook Route] Request received:', url);

	// Get the catch-all parameter - this is the path after /storybook/
	const pathParam = getRouterParam(event, '_') || '';

	// Extract path - if catch-all is empty or just /, it means we're at /storybook root
	let path = pathParam || 'index.html';

	// If path is just "/" treat as index.html
	if (path === '/') {
		path = 'index.html';
	}

	// Remove leading slash if present
	if (path.startsWith('/')) {
		path = path.slice(1);
	}

	// Security: prevent directory traversal
	if (path.includes('..')) {
		throw createError({
			statusCode: 403,
			message: 'Forbidden',
		});
	}

	const cwd = process.cwd();

	console.log('[Storybook Route] CWD:', cwd);

	const possibleDirs = [
		// Vercel paths
		join(cwd, '..', '..', 'static', 'storybook'),
		join(cwd, '..', 'static', 'storybook'),
		join('/var/task', 'storybook'),
		// Local development paths
		join(cwd, '.output', 'public', 'storybook'),
		join(cwd, 'public', 'storybook'),
	];

	let storybookDir: string | null = null;
	let filePath: string | null = null;

	for (const dir of possibleDirs) {
		if (existsSync(dir)) {
			storybookDir = dir;
			filePath = join(dir, path);
			console.log('[Storybook Route] Found directory:', dir);
			console.log('[Storybook Route] Serving file:', filePath);
			break;
		}
	}

	if (!storybookDir || !filePath) {
		console.error(
			'[Storybook Route] Directory not found. Tried:',
			possibleDirs
		);
		console.error('[Storybook Route] Current working directory:', cwd);
		throw createError({
			statusCode: 404,
			message: 'Storybook not found',
		});
	}

	// Check if file exists
	if (!existsSync(filePath)) {
		// SPA routing fallback - serve index.html for any non-file path
		if (path !== 'index.html' && existsSync(join(storybookDir, 'index.html'))) {
			const indexHtml = await readFile(
				join(storybookDir, 'index.html'),
				'utf-8'
			);
			setHeader(event, 'Content-Type', 'text/html');
			return indexHtml;
		}

		console.error('[Storybook Route] File not found:', filePath);
		throw createError({
			statusCode: 404,
			message: `File not found: ${path}`,
		});
	}

	const file = await readFile(filePath);

	const ext = path.split('.').pop()?.toLowerCase();
	const contentTypes: Record<string, string> = {
		html: 'text/html',
		js: 'application/javascript',
		css: 'text/css',
		json: 'application/json',
		png: 'image/png',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		svg: 'image/svg+xml',
		woff: 'font/woff',
		woff2: 'font/woff2',
	};

	setHeader(
		event,
		'Content-Type',
		contentTypes[ext || ''] || 'application/octet-stream'
	);
	return file;
});
