#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const VERCEL_API_BASE = 'https://api.vercel.com/v6/deployments';

function loadEnvFile(path) {
	if (!existsSync(path)) return;

	try {
		const envContent = readFileSync(path, 'utf-8');
		const lines = envContent.split('\n');

		for (const line of lines) {
			const trimmed = line.trim();

			if (!trimmed || trimmed.startsWith('#')) continue;

			const equalIndex = trimmed.indexOf('=');
			if (equalIndex === -1) continue;

			const key = trimmed.slice(0, equalIndex).trim();
			let value = trimmed.slice(equalIndex + 1).trim();

			if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				value = value.slice(1, -1);
			}

			if (process.env[key] === undefined) {
				process.env[key] = value;
			}
		}
	} catch (error) {
		console.warn(`Failed to read env file ${path}: ${error.message}`);
	}
}

function loadEnv() {
	const cwd = process.cwd();
	loadEnvFile(resolve(cwd, '.env'));
	loadEnvFile(resolve(cwd, '.env.local'));
}

loadEnv();

function formatBuildDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}`;
}

async function fetchDeploymentCount(projectId, authToken) {
	let totalCount = 0;
	let nextUrl = `${VERCEL_API_BASE}?projectId=${projectId}&state=READY&limit=100`;

	while (nextUrl) {
		const response = await fetch(nextUrl, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});

		if (!response.ok) {
			throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.deployments || !Array.isArray(data.deployments)) {
			throw new Error('Invalid response from Vercel API: missing deployments array');
		}

		totalCount += data.deployments.length;

		if (data.pagination?.next) {
			nextUrl = `${VERCEL_API_BASE}?projectId=${projectId}&state=READY&limit=100&until=${data.pagination.next}`;
		} else {
			nextUrl = null;
		}
	}

	return totalCount;
}

async function main() {
	const projectId = process.env.VERCEL_PROJECT_ID;
	const authToken = process.env.VERCEL_AUTH_TOKEN;

	let buildNumber = '-';
	let buildDate = formatBuildDate(new Date());

	if (!projectId || !authToken) {
		console.log('\nVercel credentials not configured (VERCEL_PROJECT_ID or VERCEL_AUTH_TOKEN missing)');
		console.log('Using default build number: "-"\n');
	} else {
		try {
			console.log('\nFetching deployment count from Vercel...');
			const deploymentCount = await fetchDeploymentCount(projectId, authToken);
			buildNumber = String(deploymentCount + 1);
			console.log(`Found ${deploymentCount} existing deployments\n`);
		} catch (error) {
			console.error('\nFailed to fetch deployment count from Vercel API');
			console.error(`Error: ${error.message}`);
			console.log('Using default build number: "-"\n');
		}
	}

	console.log(`Building version #${buildNumber} at ${buildDate}\n`);

	const buildEnv = {
		...process.env,
		NUXT_PUBLIC_BUILD_NUMBER: buildNumber,
		NUXT_PUBLIC_BUILD_DATE: buildDate,
	};

	try {
		console.log('Building Storybook...\n');
		execSync('pnpm build-storybook', { stdio: 'inherit', env: buildEnv });
	} catch {
		console.error('\nStorybook build failed');
		process.exit(1);
	}

	try {
		execSync('nuxt build --dotenv .env.local', { stdio: 'inherit', env: buildEnv });
	} catch {
		console.error('\nBuild failed');
		process.exit(1);
	}

	console.log(`\nBuild #${buildNumber} completed successfully\n`);
}

main();
