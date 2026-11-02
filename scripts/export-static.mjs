// Builds a fully static version of the site and zips it for FTP upload.
// Usage: yarn export:static   ->   export/input-idea-static-YYYYMMDD-HHMM.zip
// Flags: --allow-missing (zip even if links point to missing pages)
//        --no-zip        (leave the site in .output/public; used by the GitHub workflow)
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const publicDir = resolve(root, '.output/public');
const exportDir = resolve(root, 'export');

const ALLOW_MISSING = process.argv.includes('--allow-missing');
const NO_ZIP = process.argv.includes('--no-zip');
const IN_GITHUB = process.env.GITHUB_ACTIONS === 'true';
if (existsSync(resolve(root, '.env.local'))) process.loadEnvFile(resolve(root, '.env.local'));
const SITE_URL = (process.env.SITE_URL || 'https://www.inputidea.it').replace(/\/$/, '');

const run = (cmd, args, opts = {}) => {
	const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: root, ...opts });
	if (r.status !== 0) process.exit(r.status ?? 1);
};

// 1. static generate (published Storyblok content; images stay on Storyblok's CDN)
run('npx', ['nuxt', 'generate', '--dotenv', '.env.local'], {
	env: { ...process.env, STATIC_EXPORT: 'true', STORYBLOK_FORCE_DRAFT: 'false', SHOW_DEBUG: 'false' },
});
if (!existsSync(resolve(publicDir, 'index.html'))) {
	console.error('Generate finished but .output/public/index.html is missing.');
	process.exit(1);
}

// 2. verify every page was exported
const walk = dir =>
	readdirSync(dir, { withFileTypes: true }).flatMap(e =>
		e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
	);
const htmlFiles = walk(publicDir).filter(f => f.endsWith('.html'));
const toRoute = f => {
	const r = '/' + relative(publicDir, f).replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
	return r.length > 1 ? r.replace(/\/$/, '') : '/';
};
const exported = new Set(htmlFiles.map(toRoute));
const normalize = href => {
	const p = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
	return decodeURIComponent(p);
};

// a) every internal link found in the exported HTML
const expected = new Map(); // route -> where it came from
for (const f of htmlFiles) {
	const html = readFileSync(f, 'utf8');
	for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
		if (href.startsWith('//') || href.startsWith('/_') || /\.[a-z0-9]{2,5}([?#]|$)/i.test(href)) continue;
		const route = normalize(href);
		if (!expected.has(route)) expected.set(route, `linked from ${toRoute(f)}`);
	}
}

// b) every published project/service in Storyblok
const token = process.env.STORYBLOK_KEY;
if (token) {
	for (let page = 1; ; page++) {
		const res = await fetch(
			`https://api.storyblok.com/v2/cdn/stories?token=${token}&version=published&per_page=100&page=${page}&excluding_fields=body`
		);
		if (!res.ok) {
			console.warn(`⚠ Storyblok check skipped (HTTP ${res.status})`);
			break;
		}
		const { stories } = await res.json();
		stories
			.filter(s => /^(progetti|servizi)\/[^/]+$/.test(s.full_slug))
			.forEach(s => expected.set(`/${s.full_slug}`, 'published in Storyblok'));
		if (stories.length < 100) break;
	}
} else {
	console.warn('⚠ STORYBLOK_KEY missing: Storyblok page check skipped');
}

const missing = [...expected].filter(([route]) => !exported.has(route));
const pages = [...exported].filter(r => !['/404', '/200'].includes(r)).sort();
console.info(`\n[verify] ${pages.length} pages exported, ${expected.size} expected routes checked`);
if (missing.length) {
	console.error(`✖ ${missing.length} page(s) missing from the export:`);
	missing.forEach(([route, from]) => {
		console.error(`   ${route}  (${from})`);
		// surfaced as warnings on the /export page
		if (IN_GITHUB) console.log(`::warning title=Missing page::${route} (${from})`);
	});
	if (!ALLOW_MISSING) {
		console.error('\nFix the links/content, or re-run with --allow-missing to zip anyway.');
		process.exit(1);
	}
}

// 3. remove HTML comments (keeps Vue's hydration markers <!--[-->, <!--]-->, <!---->)
const VUE_MARKER = /^(\[|\]|teleport (start|end)|)$/;
let strippedComments = 0;
for (const f of htmlFiles) {
	const html = readFileSync(f, 'utf8');
	const clean = html.replace(/<!--([\s\S]*?)-->/g, (m, body) => {
		if (VUE_MARKER.test(body)) return m;
		strippedComments++;
		return '';
	});
	if (clean !== html) writeFileSync(f, clean);
}
const jsFiles = walk(publicDir).filter(f => f.endsWith('.js'));
const consoleCalls = jsFiles.reduce(
	(n, f) => n + (readFileSync(f, 'utf8').match(/\bconsole\.(log|info|warn|error|debug|group|table|trace)\(/g)?.length ?? 0),
	0
);
console.info(`[clean] ${strippedComments} HTML comments removed, ${consoleCalls} console calls left in JS`);

// 4. sitemap.xml (always rebuilt from what was actually exported; noindex pages skipped)
const today = new Date().toISOString().slice(0, 10);
const indexable = pages.filter(route => {
	const file = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
	const path = resolve(publicDir, file);
	const html = existsSync(path) ? readFileSync(path, 'utf8') : '';
	return !/<meta[^>]+name="robots"[^>]+noindex/i.test(html);
});
writeFileSync(
	resolve(publicDir, 'sitemap.xml'),
	`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(r => `  <url><loc>${SITE_URL}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
);
writeFileSync(resolve(publicDir, 'robots.txt'), `User-agent: *\nDisallow:\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.info(`[sitemap] ${indexable.length} URLs -> sitemap.xml (${SITE_URL})`);

// 5. Apache config (ignored by other servers): 404 page + long cache for hashed assets
writeFileSync(
	resolve(publicDir, '.htaccess'),
	`ErrorDocument 404 /404.html
DirectorySlash On

<IfModule mod_headers.c>
  <FilesMatch "\\.(js|css|woff2?)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(html|json)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`
);

if (NO_ZIP) {
	console.info(`\n✔ Static site ready in ${publicDir}`);
	process.exit(0);
}

// 6. zip the contents of .output/public (not the folder itself)
mkdirSync(exportDir, { recursive: true });
const d = new Date();
const pad = n => String(n).padStart(2, '0');
const name = `input-idea-static-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.zip`;
const zipPath = resolve(exportDir, name);
run('zip', ['-rqX', zipPath, '.', '-x', '*.DS_Store'], { cwd: publicDir });

console.info(`\n✔ Static site ready: ${zipPath}\n  Upload the zip contents to the web root of your FTP server.`);
