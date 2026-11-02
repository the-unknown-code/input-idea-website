<!--
  /export — lets the client build the static (FTP) version of the site and download it as a zip.
  The build runs on GitHub Actions (.github/workflows/static-export.yml) via /api/export/*.
-->
<template>
	<main class="page-export">
		<section class="card">
			<p class="eyebrow">Input Idea</p>
			<h1>Esporta il sito statico</h1>

			<!-- password -->
			<form v-if="state === 'login'"
				class="stack"
				@submit.prevent="login">
				<p class="muted">Inserisci la password per creare lo zip del sito da caricare via FTP.</p>
				<input v-model="password"
					type="password"
					placeholder="Password"
					autocomplete="current-password"
					required>
				<button :disabled="busy || !password"
					type="submit">
					{{ busy ? 'Verifico…' : 'Entra' }}
				</button>
			</form>

			<!-- ready -->
			<div v-else-if="state === 'idle'"
				class="stack">
				<p class="muted">
					Verrà generata una copia completa del sito con i contenuti pubblicati su Storyblok.
					Ci vogliono circa 2–4 minuti.
				</p>
				<button :disabled="busy"
					@click="start">
					{{ busy ? 'Avvio…' : 'Crea zip' }}
				</button>
			</div>

			<!-- running / finished -->
			<div v-else
				class="stack">
				<div class="progress"
					:class="state">
					<div class="progress__bar"
						:style="{ transform: `scaleX(${progress})` }" />
				</div>
				<p class="muted small">
					<template v-if="state === 'running'">
						In corso da {{ elapsedLabel }} — puoi lasciare aperta questa pagina.
					</template>
					<template v-else-if="state === 'success'">
						Completato in {{ elapsedLabel }}.
					</template>
					<template v-else>
						Qualcosa è andato storto.
					</template>
				</p>

				<ol class="steps">
					<li v-for="step in displaySteps"
						:key="step.name"
						:class="step.state">
						<span class="dot" />
						{{ step.name }}
					</li>
				</ol>

				<div v-if="state === 'success'"
					class="stack">
					<button :disabled="busy"
						@click="download">
						{{ busy ? 'Preparo il download…' : 'Scarica zip' }}
					</button>
					<div v-if="warnings.length"
						class="warnings">
						<p><strong>Attenzione:</strong> questi link puntano a pagine che non esistono:</p>
						<ul>
							<li v-for="w in warnings"
								:key="w">
								{{ w }}
							</li>
						</ul>
					</div>
					<button class="ghost"
						@click="reset">
						Nuova esportazione
					</button>
				</div>

				<button v-if="state === 'failed'"
					@click="reset">
					Riprova
				</button>
			</div>

			<p v-if="error"
				class="error">
				{{ error }}
			</p>
		</section>
	</main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: 'Esporta sito', meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

type Step = { name: string; status: string; conclusion: string | null };
type State = 'login' | 'idle' | 'running' | 'success' | 'failed';

// must match the step names in .github/workflows/static-export.yml
const EXPECTED_STEPS = [
	'Scarico il codice',
	"Preparo l'ambiente",
	'Installo le dipendenze',
	'Genero le pagine del sito',
	'Creo il file zip',
];
const STORAGE_KEY = 'static-export';

const state = ref<State>('login');
const password = ref('');
const busy = ref(false);
const error = ref('');
const exportId = ref('');
const runId = ref<number | null>(null);
const steps = ref<Step[]>([]);
const warnings = ref<string[]>([]);
const startedAt = ref(0);
const now = ref(Date.now());

let pollTimer: ReturnType<typeof setTimeout> | undefined;
let clockTimer: ReturnType<typeof setInterval> | undefined;

const storage = {
	get: (s: Storage, k: string) => { try { return s.getItem(k); } catch { return null; } },
	set: (s: Storage, k: string, v: string) => { try { s.setItem(k, v); } catch { /* storage unavailable */ } },
	remove: (s: Storage, k: string) => { try { s.removeItem(k); } catch { /* storage unavailable */ } },
};

const api = <T>(url: string, opts: { method?: 'GET' | 'POST'; query?: Record<string, any> } = {}) =>
	$fetch<T>(url, { ...opts, headers: { 'x-export-password': password.value } });

const errorMessage = (e: any) =>
	e?.statusCode === 401
		? 'Password errata.'
		: e?.statusCode === 503
			? 'Esportazione non configurata sul server.'
			: e?.statusCode === 502
				? `Errore GitHub — ${e?.statusMessage ?? e?.data?.statusMessage ?? ''}`
				: `Errore di connessione (${e?.statusCode ?? 'rete'}), riprova.`;

const displaySteps = computed(() =>
	EXPECTED_STEPS.map((name) => {
		const s = steps.value.find(step => step.name === name);
		let stepState = 'pending';
		if (s?.status === 'completed') stepState = s.conclusion === 'success' || s.conclusion === 'skipped' ? 'done' : 'failed';
		else if (s?.status === 'in_progress') stepState = 'active';
		return { name, state: stepState };
	})
);

const progress = computed(() => {
	if (state.value === 'success') return 1;
	const done = displaySteps.value.filter(s => s.state === 'done').length;
	const active = displaySteps.value.some(s => s.state === 'active') ? 0.5 : 0;
	return Math.max(0.03, (done + active) / EXPECTED_STEPS.length);
});

const elapsedLabel = computed(() => {
	const sec = startedAt.value ? Math.max(0, Math.round((now.value - startedAt.value) / 1000)) : 0;
	return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
});

const stopTimers = () => {
	clearTimeout(pollTimer);
	clearInterval(clockTimer);
};

const poll = async () => {
	try {
		const res = await api<{ state: string; runId?: number; startedAt?: string; steps: Step[]; warnings: string[] }>(
			'/api/export/status',
			{ query: { id: exportId.value } }
		);
		steps.value = res.steps;
		if (res.runId) runId.value = res.runId;
		if (res.startedAt) startedAt.value = new Date(res.startedAt).getTime();
		if (res.state === 'success' || res.state === 'failed') {
			state.value = res.state;
			warnings.value = res.warnings;
			now.value = Date.now();
			stopTimers();
			return;
		}
		error.value = '';
	} catch (e) {
		error.value = errorMessage(e);
	}
	pollTimer = setTimeout(poll, 4000);
};

const track = (id: string, since: number) => {
	exportId.value = id;
	startedAt.value = since;
	state.value = 'running';
	stopTimers();
	clockTimer = setInterval(() => (now.value = Date.now()), 1000);
	poll();
};

const login = async () => {
	busy.value = true;
	error.value = '';
	try {
		// cheap call that validates password + server config
		await api('/api/export/status', { query: { id: 'check' } });
		storage.set(sessionStorage, `${STORAGE_KEY}:pw`, password.value);
		resumeOrIdle();
	} catch (e) {
		error.value = errorMessage(e);
	} finally {
		busy.value = false;
	}
};

const start = async () => {
	busy.value = true;
	error.value = '';
	try {
		const { exportId: id } = await api<{ exportId: string }>('/api/export/start', { method: 'POST' });
		storage.set(localStorage, STORAGE_KEY, JSON.stringify({ id, since: Date.now() }));
		steps.value = [];
		warnings.value = [];
		track(id, Date.now());
	} catch (e) {
		error.value = errorMessage(e);
	} finally {
		busy.value = false;
	}
};

const download = async () => {
	if (!runId.value) return;
	busy.value = true;
	error.value = '';
	try {
		const { url } = await api<{ url: string }>('/api/export/download', { query: { run: runId.value } });
		window.location.href = url;
	} catch (e: any) {
		error.value = e?.statusCode === 404 ? 'Lo zip è scaduto: crea una nuova esportazione.' : errorMessage(e);
	} finally {
		busy.value = false;
	}
};

const reset = () => {
	stopTimers();
	storage.remove(localStorage, STORAGE_KEY);
	steps.value = [];
	warnings.value = [];
	runId.value = null;
	error.value = '';
	state.value = 'idle';
};

const resumeOrIdle = () => {
	const saved = storage.get(localStorage, STORAGE_KEY);
	if (saved) {
		try {
			const { id, since } = JSON.parse(saved);
			if (id) return track(id, since);
		} catch { /* ignore corrupted state */ }
	}
	state.value = 'idle';
};

onMounted(() => {
	const saved = storage.get(sessionStorage, `${STORAGE_KEY}:pw`);
	if (saved) {
		password.value = saved;
		resumeOrIdle();
	}
});

onBeforeUnmount(stopTimers);
</script>

<style lang="scss" scoped>
.page-export {
	min-height: 100vh;
	display: grid;
	place-items: center;
	padding: 24px;
	background: #080808;
	color: #fffef4;
}

.card {
	width: 100%;
	max-width: 460px;
	padding: 40px 32px;
	border: 1px solid #2f2c2c;
	border-radius: 20px;
	background: #121212;

	h1 {
		margin: 4px 0 24px;
		font-size: 28px;
		line-height: 1.15;
		font-weight: 600;
		text-transform: none;
	}
}

.eyebrow {
	font-size: 12px;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--yellow, #ffff00);
}

.stack {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.muted {
	color: #909090;
	font-size: 15px;
	line-height: 1.5;
}

.small {
	font-size: 13px;
}

input {
	padding: 14px 16px;
	border: 1px solid #3b3a3a;
	border-radius: 12px;
	background: #080808;
	color: inherit;
	font: inherit;

	&:focus {
		outline: none;
		border-color: var(--yellow, #ffff00);
	}
}

button {
	padding: 14px 20px;
	border: 0;
	border-radius: 12px;
	background: var(--yellow, #ffff00);
	color: #080808;
	font: inherit;
	font-weight: 600;
	cursor: pointer;
	transition: opacity 0.2s ease;

	&:disabled {
		opacity: 0.5;
		cursor: default;
	}

	&.ghost {
		background: transparent;
		color: #909090;
		border: 1px solid #3b3a3a;
	}
}

.progress {
	height: 6px;
	border-radius: 6px;
	background: #2f2c2c;
	overflow: hidden;

	&__bar {
		height: 100%;
		background: var(--yellow, #ffff00);
		transform-origin: left;
		transition: transform 0.6s ease;
	}

	&.running .progress__bar {
		animation: pulse 1.6s ease-in-out infinite;
	}

	&.failed .progress__bar {
		background: #ff5a4f;
	}
}

.steps {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 0;
	list-style: none;
	font-size: 15px;

	li {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #606060;
		transition: color 0.3s ease;

		&.active,
		&.done {
			color: #fffef4;
		}

		&.failed {
			color: #ff5a4f;
		}
	}

	.dot {
		flex: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid currentColor;
	}

	.active .dot {
		border-color: var(--yellow, #ffff00);
		border-top-color: transparent;
		animation: spin 0.8s linear infinite;
	}

	.done .dot {
		border-color: var(--yellow, #ffff00);
		background: var(--yellow, #ffff00);
	}

	.failed .dot {
		background: currentColor;
	}
}

.warnings {
	padding: 16px;
	border-radius: 12px;
	background: rgb(255 255 0 / 6%);
	font-size: 13px;
	line-height: 1.5;
	color: #fffef4;

	ul {
		margin-top: 8px;
		padding-left: 18px;
		list-style: disc;
		color: #909090;
	}
}

.error {
	margin-top: 16px;
	color: #ff5a4f;
	font-size: 14px;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

@keyframes pulse {
	50% {
		opacity: 0.6;
	}
}
</style>
