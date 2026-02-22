/**
 * Triggers a new Vercel deployment for the given branch.
 * Requires VERCEL_AUTH_TOKEN and VERCEL_PROJECT_ID in server env.
 * Fetches the project's link.repoId from the API, then creates a deployment with gitSource.repoId + ref.
 */

const VERCEL_API = 'https://api.vercel.com';
const PROJECTS_PATH = '/v9/projects';
const DEPLOYMENTS_PATH = '/v13/deployments';

export default defineEventHandler(async (event) => {
	const authToken = process.env.VERCEL_AUTH_TOKEN;
	const projectId = process.env.VERCEL_PROJECT_ID;

	if (!authToken || !projectId) {
		throw createError({
			statusCode: 503,
			statusMessage: 'Vercel deploy not configured',
			message:
				'VERCEL_AUTH_TOKEN and VERCEL_PROJECT_ID must be set to trigger deployments.',
		});
	}

	const body = await readBody(event).catch(() => ({}));
	const branch =
		typeof body?.branch === 'string' && body.branch.trim()
			? body.branch.trim()
			: process.env.VERCEL_GIT_COMMIT_REF;

	if (!branch) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Branch required',
			message: 'Provide a branch name in the request body, or ensure VERCEL_GIT_COMMIT_REF is set.',
		});
	}

	const headers = {
		Authorization: `Bearer ${authToken}`,
		'Content-Type': 'application/json',
	};

	// Get project to read link.repoId (required by create deployment API)
	const projectRes = await fetch(
		`${VERCEL_API}${PROJECTS_PATH}/${encodeURIComponent(projectId)}`,
		{ headers }
	);
	const projectData = await projectRes.json().catch(() => ({}));

	if (!projectRes.ok) {
		const msg =
			projectData?.error?.message ?? projectData?.message ?? projectRes.statusText;
		throw createError({
			statusCode: projectRes.status,
			statusMessage: 'Vercel project fetch failed',
			message: typeof msg === 'string' ? msg : 'Failed to load project.',
		});
	}

	const link = projectData?.link;
	const repoId = link?.repoId;
	const gitType = link?.type ?? 'github';

	if (repoId == null) {
		throw createError({
			statusCode: 503,
			statusMessage: 'Project not linked to Git',
			message: 'This Vercel project has no Git link (link.repoId). Connect a repository in the project settings.',
		});
	}

	const deployUrl = new URL(VERCEL_API + DEPLOYMENTS_PATH);
	deployUrl.searchParams.set('forceNew', '1');

	const projectName =
		typeof projectData?.name === 'string' && projectData.name.trim()
			? projectData.name.trim()
			: projectId;

	const requestBody = {
		name: projectName,
		project: projectId,
		gitSource: { type: gitType, repoId: Number(repoId), ref: branch },
	};

	const response = await fetch(deployUrl.toString(), {
		method: 'POST',
		headers,
		body: JSON.stringify(requestBody),
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		const message =
			data?.error?.message ?? data?.message ?? response.statusText;
		throw createError({
			statusCode: response.status,
			statusMessage: 'Vercel API error',
			message: typeof message === 'string' ? message : 'Failed to create deployment',
		});
	}

	return {
		ok: true,
		deploymentId: data.id,
		url: data.url,
		status: data.status,
		branch,
	};
});
