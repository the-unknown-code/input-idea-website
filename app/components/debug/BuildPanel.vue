<template>
	<div v-if="isPanelVisible" class="panel-shell" :class="panelState">
		<div class="panel-inner">
			<div class="panel-header">
				<div v-if="panelState !== 'collapsed'" class="header-content">
					<span class="env">{{ buildData.env }}</span>
					<span class="divider">|</span>
					<span class="build">{{ buildData.buildNumber ?? '-' }}</span>
					<span class="divider">|</span>
				</div>

				<button
					v-if="panelState !== 'collapsed'"
					class="arrow-btn toggle-arrow"
					aria-label="Expand or minimize"
					@click="handleLeftArrow"
				>
					▲
				</button>

				<button
					v-if="panelState !== 'collapsed'"
					class="arrow-btn collapse-arrow"
					aria-label="Collapse panel"
					@click="collapse"
				>
					▶
				</button>

				<button
					v-if="panelState === 'collapsed'"
					class="arrow-btn restore-arrow"
					aria-label="Restore panel"
					@click="minimize"
				>
					◀
				</button>
			</div>

			<div
				v-show="panelState === 'expanded'"
				ref="containerRef"
				class="pane-content"
			/>

			<div v-if="panelState === 'expanded'" class="panel-footer">
				<button
					type="button"
					class="deploy-btn"
					aria-label="Trigger new Vercel deployment for this branch"
					:disabled="deployLoading || !buildData.branch || buildData.branch === 'Unknown'"
					@click="triggerDeploy"
				>
					{{ deployLoading ? 'Deploying…' : `Redeploy ${buildData.branch}` }}
				</button>
				<p v-if="deployError" class="deploy-error">{{ deployError }}</p>
				<p v-if="deploySuccess" class="deploy-success">{{ deploySuccess }}</p>
				<button
					class="remove-btn"
					aria-label="Remove panel"
					@click="removePanel"
				>
					Remove from DOM
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Pane } from 'tweakpane';
import Bowser from 'bowser';
import useAppStore from '~/store/useAppStore';

const appStore = useAppStore();
const containerRef = ref<HTMLElement | null>(null);
let pane: Pane | null = null;

const runtimeBuild = useRuntimeConfig().public.build;
const breakpoints = useRuntimeConfig().public.breakpoints;

const isDev = import.meta.env.DEV;
const scope = effectScope();

type PanelState = 'minimized' | 'expanded' | 'collapsed';
const panelState = ref<PanelState>('minimized');
const isPanelVisible = ref(true);

const { width, height } = useWindowSize();

const currentBreakpoint = computed(() => {
	if (width.value < breakpoints.mobile) return 'Mobile';
	if (width.value < breakpoints.wide) return 'Desktop';
	return 'Wide';
});

const viewportSize = computed(() => `${width.value} × ${height.value}`);

const browserInfo = ref({ name: 'Unknown', version: 'Unknown' });
const osInfo = ref('Unknown');

const detectBrowser = () => {
	if (typeof window === 'undefined') return;

	const parser = Bowser.parse(navigator.userAgent);
	browserInfo.value = {
		name: parser.browser.name ?? 'Unknown',
		version: parser.browser.version ?? 'Unknown',
	};

	osInfo.value = [parser.os.name, parser.os.version, parser.os.versionName]
		.filter(Boolean)
		.join(' ');
};

const getDeviceDetails = () => {
	const parsed = Bowser.parse(navigator.userAgent);
	if (parsed.platform.type === 'desktop') return 'Desktop';
	return (
		[parsed.platform.vendor, parsed.platform.model].filter(Boolean).join(' ') ||
		'Unknown'
	);
};

const deviceData = reactive({
	breakpoint: '',
	viewport: '',
	os: '',
	browser: '',
	device: '',
});


const buildData = reactive({
	env: runtimeBuild.env ?? 'development',
	branch: runtimeBuild.branch ?? 'Unknown',
	commit: runtimeBuild.commit ? runtimeBuild.commit.slice(0, 7) : 'Unknown',
	version: runtimeBuild.version ?? 'Unknown',
	buildNumber: runtimeBuild.buildNumber ?? runtimeBuild.version ?? '-',
	buildDate: runtimeBuild.buildDate ?? '-',
});

const deployLoading = ref(false);
const deployError = ref('');
const deploySuccess = ref('');

const triggerDeploy = async () => {
	const branch = buildData.branch;
	if (!branch || branch === 'Unknown') return;
	deployError.value = '';
	deploySuccess.value = '';
	deployLoading.value = true;
	try {
		const res = await $fetch<{ ok: boolean; url?: string; status?: string }>(
			'/api/vercel/deploy',
			{
				method: 'POST',
				body: { branch },
			}
		);
		if (res?.ok) {
			deploySuccess.value = res.url
				? `Deployment started. Preview: ${res.url}`
				: 'Deployment started.';
			setTimeout(() => (deploySuccess.value = ''), 6000);
		}
	} catch (e: any) {
		deployError.value =
			e?.data?.message ?? e?.message ?? 'Failed to trigger deployment.';
	} finally {
		deployLoading.value = false;
	}
};

// DEV-ONLY hydration (local git)
const hydrateLocalBuildInfo = async () => {
	if (!isDev) return;

	try {
		const [branch, commit, version] = await Promise.all([
			fetch('/api/git/branch').then(r => (r.ok ? r.text() : null)),
			fetch('/api/git/commit').then(r => (r.ok ? r.text() : null)),
			fetch('/api/version').then(r => (r.ok ? r.text() : null)),
		]);

		if (branch) buildData.branch = branch;
		if (commit) buildData.commit = commit.slice(0, 7);
		if (version) {
			buildData.version = version.trim();
			buildData.buildNumber = version.trim();
		}
	} catch {
		console.warn('[DebugPanel] Local git info unavailable');
	}
};

tryOnMounted(hydrateLocalBuildInfo);

const expand = async () => {
	panelState.value = 'expanded';
	if (!pane) {
		await nextTick();
		containerRef.value!.innerHTML = '';
		await initialize();
		logDebugInfo();
	}
};

const minimize = () => (panelState.value = 'minimized');
const collapse = () => (panelState.value = 'collapsed');
const removePanel = () => (isPanelVisible.value = false);

const handleLeftArrow = () => {
	if (panelState.value === 'collapsed') minimize();
	else if (panelState.value === 'minimized') expand();
	else minimize();
};

const initialize = async () => {
	if (!containerRef.value) return;

	detectBrowser();

	deviceData.breakpoint = currentBreakpoint.value;
	deviceData.viewport = viewportSize.value;
	deviceData.os = osInfo.value;
	deviceData.browser = `${browserInfo.value.name} ${browserInfo.value.version}`;
	deviceData.device = getDeviceDetails();

	pane = new Pane({ container: containerRef.value });
	//@ts-expect-error - Pane is not typed
	const deviceFolder = pane.addFolder({ title: 'Device Info', expanded: true });
	['breakpoint', 'viewport', 'os', 'browser', 'device'].forEach(k =>
		deviceFolder.addBinding(deviceData, k, { readonly: true })
	);
	//@ts-expect-error - Pane is not typed
	const buildFolder = pane.addFolder({ title: 'Build Info', expanded: true });
	['branch', 'version', 'commit', 'env', 'buildNumber', 'buildDate'].forEach(k =>
		buildFolder.addBinding(buildData, k, { readonly: true })
	);
	//@ts-expect-error - Pane is not typed
	const gridFolder = pane.addFolder({ title: 'Layout Grid', expanded: true });
	gridFolder
		.addBinding({ showGrid: appStore.debug.orchestra }, 'showGrid')
		.on('change', ({ value }: { value: boolean }) =>
			appStore.setDebug('orchestra', value)
		);
};

scope.run(() => {
	watch(
		[
			currentBreakpoint,
			viewportSize,
			osInfo,
			() => `${browserInfo.value.name} ${browserInfo.value.version}`,
		],
		([bp, vp, os, browser]) => {
			deviceData.breakpoint = bp;
			deviceData.viewport = vp;
			deviceData.os = os;
			deviceData.browser = browser;
			deviceData.device = getDeviceDetails();
		},
		{ immediate: true }
	);
});

const logDebugInfo = () => {
	console.group('Debug Info');
	console.info('Device Info:', { ...deviceData });
	console.info('Build Info:', { ...buildData });
	console.groupEnd();
};

tryOnBeforeUnmount(() => {
	scope.stop();
	pane?.dispose();
});
</script>

<style lang="scss" scoped>
.panel-shell {
	position: fixed;
	bottom: 16px;
	right: 20px;
	z-index: 999999;
	font-family: system-ui, sans-serif;
	pointer-events: none;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	height: auto;
}

.panel-inner {
	pointer-events: auto;
	background: #28292e;
	color: #bbbcc4;
	font-size: 11px;
	font-weight: 500;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	border-radius: 6px;
	overflow: hidden;
	transition: all 0.45s cubic-bezier(0.34, 0, 0.2, 1);
	width: 320px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	display: flex;
	flex-direction: column;
	max-height: 75vh;
}

/* Minimized: only header visible, compact pill */
.panel-shell.minimized .panel-inner {
	padding: 0 12px;
	display: flex;
	align-items: center;
	width: auto;
	min-width: auto;
}

/* Collapsed: only right arrow visible */
.panel-shell.collapsed .panel-inner {
	padding: 0;
	width: auto;
	min-width: auto;
}

.panel-shell.collapsed .panel-header {
	padding: 8px 12px;
	gap: 0;
}

// Expanded state
.panel-shell.expanded .panel-inner {
	height: auto;
	max-height: 80vh;
	padding: 0;
	cursor: pointer;
}

.panel-header {
	display: flex;
	align-items: center;
	gap: 6px;
	height: 24px;
	padding: 0 8px;
	background: #28292e;
	// flex-shrink: 0;
	user-select: none;
}

.header-content {
	display: flex;
	align-items: center;
	gap: 6px;
}

.arrow-btn {
	background: none;
	border: none;
	color: #bbbcc4;
	font-size: 12px;
	opacity: 0.7;
	cursor: pointer;
	padding: 2px;
	transition:
		opacity 0.2s ease,
		transform 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		opacity: 1;
	}
}

/* ▲ rotates based on state */
.panel-shell.minimized .toggle-arrow {
	transform: rotate(0deg);
}

.panel-shell.expanded .toggle-arrow {
	transform: rotate(180deg);
}

.panel-shell.collapsed .header-content {
	display: none;
}

.collapse-arrow {
	margin-left: 2px;
}

.restore-arrow {
	transform: none;
}

.panel-footer {
	padding: 8px 12px;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	background: #1f2024;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.deploy-btn {
	width: 100%;
	padding: 6px;
	background: rgba(0, 122, 255, 0.2);
	border: 1px solid rgba(0, 122, 255, 0.4);
	color: #5ac8fa;
	font-size: 11px;
	font-weight: 500;
	border-radius: 3px;
	cursor: pointer;
	transition:
		background 0.2s ease,
		color 0.2s ease;
}

.deploy-btn:hover:not(:disabled) {
	background: rgba(0, 122, 255, 0.35);
	color: #7dd3fc;
}

.deploy-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.deploy-error {
	font-size: 10px;
	color: #ff6b6b;
	margin: 0;
}

.deploy-success {
	font-size: 10px;
	color: #69db7c;
	margin: 0;
}

.remove-btn {
	width: 100%;
	padding: 6px;
	background: rgba(255, 255, 255, 0.08);
	border: 1px solid rgba(255, 255, 255, 0.12);
	color: #bbbcc4;
	font-size: 11px;
	font-weight: 500;
	border-radius: 3px;
	cursor: pointer;
	transition:
		background 0.2s ease,
		color 0.2s ease;

	&:hover {
		background: rgba(255, 59, 48, 0.2);
		color: #ff3b30;
		border-color: rgba(255, 59, 48, 0.3);
	}
}

.pane-content {
	max-height: calc(80vh - 24px);
	overflow-y: auto;
	opacity: 0;
	transform: translateY(-8px);
	transition:
		opacity 0.4s ease,
		transform 0.4s ease;
}

.panel-shell.expanded .pane-content {
	opacity: 1;
	transform: translateY(0);
}

/* Tweakpane tweaks */
:deep(.tp-dfwv) {
	margin-top: 0 !important;
	padding-top: 12px !important;
}

:deep(.tp-biv_l) {
	font-size: 11px !important;
	padding: 6px 12px !important;
}

:deep(.tp-biv_v) {
	color: #e0e0e0 !important;
	font-size: 11px !important;
}
</style>
