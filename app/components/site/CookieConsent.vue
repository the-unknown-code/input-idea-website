<!--
  Cookie consent  <site-cookie-consent position="right" />
  ------------------------------------------------------------
  • Only the yellow launcher is visible (nothing opens by itself). It opens a small popup
    with the current state, consent date/ID ("Mostra dettagli"), "Modifica consenso"
    (re-opens the dialog) and "Revoca consenso" (back to necessary-only, asks again).
  • State + storage live in ~/libs/consent, the cookie list in ~/libs/data/cookies.ts.
-->
<template>
	<!-- teleported so position:fixed is never affected by transformed page wrappers -->
	<Teleport to="body">
	<div v-if="state.ready"
		:class="['cookie-consent', `cookie-consent--${position}`]">
		<!-- launcher + status popup -->
		<div class="cc-widget">
			<Transition name="cc-pop">
				<div v-if="state.popupOpen"
					id="cc-popup"
					class="cc-popup"
					role="dialog"
					aria-labelledby="cc-popup-title">
					<div class="cc-popup__head">
						<p id="cc-popup-title"
							class="p"><b>Impostazioni dei cookie</b></p>
						<button type="button"
							class="cc-icon-btn"
							aria-label="Chiudi"
							@click="state.popupOpen = false">
							<svg class="cc-arrow"
								viewBox="0 0 16 16"
								aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
						</button>
					</div>

					<p class="p">Il tuo stato attuale</p>
					<ul class="cc-status">
						<li v-for="cat in STATUS_ORDER"
							:key="cat.key"
							class="cc-small">
							<span :class="['cc-check', { checked: hasConsent(cat.key) }]" />
							{{ cat.label }}
						</li>
					</ul>

					<div :class="['cc-details', { open: detailsOpen }]">
						<button type="button"
							class="cc-details__toggle p"
							:aria-expanded="detailsOpen"
							@click="detailsOpen = !detailsOpen">
							{{ detailsOpen ? 'Nascondi i dettagli' : 'Mostra dettagli' }}
							<svg class="cc-arrow"
								viewBox="0 0 16 16"
								aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
						</button>
						<div :class="['cc-collapse', { open: detailsOpen }]">
							<div>
								<dl class="cc-details__list cc-tiny">
									<dt>Data del consenso:</dt>
									<dd>{{ state.record ? formatConsentDate(state.record.date) : '—' }}</dd>
									<dt>ID del consenso:</dt>
									<dd class="cc-id">{{ state.record?.id ?? '—' }}</dd>
								</dl>
							</div>
						</div>
					</div>

					<div class="cc-links">
						<button type="button"
							class="cc-link"
							@click="openConsentDialog('consent')">
							Modifica consenso <svg class="cc-arrow cc-arrow--bold"
								viewBox="0 0 16 16"
								aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
						</button>
						<button type="button"
							class="cc-link"
							@click="revokeConsent">
							Revoca consenso <svg class="cc-arrow cc-arrow--bold"
								viewBox="0 0 16 16"
								aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
						</button>
					</div>

					<!-- speech-bubble tail towards the launcher -->
					<svg class="cc-popup__tail"
						viewBox="0 0 28 28"
						aria-hidden="true"><path d="M0 0v28h28C12.5 28 0 15.5 0 0Z" /></svg>
				</div>
			</Transition>

			<button type="button"
				:class="['cc-launcher', { active: state.popupOpen }]"
				aria-label="Impostazioni dei cookie"
				aria-controls="cc-popup"
				:aria-expanded="state.popupOpen"
				@click="state.popupOpen = !state.popupOpen">
				<!-- "co" mark, traced from the design (viewBox = the yellow circle) -->
				<svg viewBox="0 0 271 271"
					aria-hidden="true"><path d="M126 162.2H99.5a26.7 26.7 0 0 1 0-53.4h74" /><circle cx="173.5"
						cy="135.5"
						r="26.7" /></svg>
			</button>
		</div>

		<!-- consent dialog -->
		<Transition name="cc-dialog">
			<div v-if="state.dialogOpen"
				class="cc-overlay"
				data-lenis-prevent
				@click.self="closeConsentDialog">
				<div class="cc-dialog"
					role="dialog"
					aria-modal="true"
					aria-label="Consenso ai cookie">
					<div class="cc-tabs"
						role="tablist">
						<button v-for="tab in TABS"
							:key="tab.key"
							type="button"
							role="tab"
							:aria-selected="state.dialogTab === tab.key"
							:class="['cc-tab p', { active: state.dialogTab === tab.key }]"
							@click="state.dialogTab = tab.key">
							<span class="cc-tab__label">{{ tab.label }}</span>
							<span class="cc-tab__short">{{ tab.short ?? tab.label }}</span>
							<svg class="cc-arrow"
								viewBox="0 0 16 16"
								aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
						</button>
					</div>

					<div class="cc-dialog__body"
						data-lenis-prevent>
						<!-- Consenso -->
						<div v-if="state.dialogTab === 'consent'"
							key="consent"
							class="cc-panel">
							<p class="cc-title p">{{ CONSENT_INTRO.title }}</p>
							<p class="cc-muted cc-small">{{ CONSENT_INTRO.text }}</p>
							<div class="cc-options">
								<label v-for="cat in COOKIE_CATEGORIES"
									:key="cat.key"
									class="cc-option cc-small">
									<input v-model="state.draft[cat.key]"
										type="checkbox"
										:disabled="cat.key === 'necessary'">
									<span class="cc-box" />
									{{ cat.label }}
								</label>
							</div>
						</div>

						<!-- Dettagli -->
						<div v-else-if="state.dialogTab === 'details'"
							key="details"
							class="cc-panel">
							<div v-for="cat in COOKIE_CATEGORIES"
								:key="cat.key"
								:class="['cc-cat', { open: openCats[cat.key] }]">
								<button type="button"
									class="cc-cat__toggle"
									:aria-expanded="!!openCats[cat.key]"
									@click="openCats[cat.key] = !openCats[cat.key]">
									<svg class="cc-arrow cc-cat__arrow"
										viewBox="0 0 16 16"
										aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
									<span class="p">{{ cat.label }}</span>
									<span class="cc-badge cc-tiny">{{ countCookies(cat.providers) }}</span>
								</button>
								<label class="cc-switch">
									<input v-model="state.draft[cat.key]"
										type="checkbox"
										:disabled="cat.key === 'necessary'"
										:aria-label="`Consenti cookie ${cat.label}`">
									<span class="cc-box cc-box--big" />
								</label>
								<p class="cc-cat__desc cc-muted cc-small">{{ cat.description }}</p>

								<div :class="['cc-collapse cc-cat__body', { open: openCats[cat.key] }]">
									<div>
										<p v-if="!cat.providers.length"
											class="cc-empty cc-muted cc-small">
											Non utilizziamo cookie di questo tipo.
										</p>
										<div v-for="provider in cat.providers"
											:key="provider.name"
											:class="['cc-provider', { open: openProviders[`${cat.key}:${provider.name}`] }]">
											<div class="cc-provider__head">
												<div>
													<p class="cc-small">
														<b>{{ provider.name }}</b>
														<span class="cc-badge cc-tiny">{{ provider.cookies.length }}</span>
													</p>
													<a v-if="provider.url"
														class="cc-provider__link cc-tiny"
														:href="provider.url"
														target="_blank"
														rel="noopener noreferrer">
														Per saperne di più su questo fornitore ↗
													</a>
												</div>
												<button type="button"
													class="cc-icon-btn cc-icon-btn--yellow"
													:aria-label="`Mostra i cookie di ${provider.name}`"
													:aria-expanded="!!openProviders[`${cat.key}:${provider.name}`]"
													@click="toggleProvider(`${cat.key}:${provider.name}`)">
													<svg class="cc-arrow cc-provider__arrow"
														viewBox="0 0 16 16"
														aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
												</button>
											</div>
											<div :class="['cc-collapse', { open: openProviders[`${cat.key}:${provider.name}`] }]">
												<div>
													<div v-for="cookie in provider.cookies"
														:key="cookie.name"
														class="cc-cookie cc-small">
														<div><b>{{ cookie.name }}</b></div>
														<div>{{ cookie.description }}</div>
														<hr>
														<div class="cc-cookie__meta">
															<span><b>Durata massima di archiviazione:</b> {{ cookie.duration }}</span>
															<span><b>Tipo:</b> {{ cookie.type }}</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Informazioni cookies -->
						<div v-else
							key="about"
							class="cc-panel cc-about">
							<p v-for="(text, i) in COOKIE_ABOUT"
								:key="i"
								class="cc-muted cc-small">{{ text }}</p>
						</div>
					</div>

					<div class="cc-actions">
						<button type="button"
							class="cc-link cc-link--muted"
							@click="rejectAll">
							Rifiuta <svg class="cc-arrow cc-arrow--bold"
								viewBox="0 0 16 16"
								aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
						</button>
						<button type="button"
							class="cc-link cc-link--muted"
							@click="acceptSelected">
							Accetta selezionati <svg class="cc-arrow cc-arrow--bold"
								viewBox="0 0 16 16"
								aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
						</button>
						<button type="button"
							class="cc-link cc-link--accent"
							@click="acceptAll">
							Accetta tutti <svg class="cc-arrow cc-arrow--bold"
								viewBox="0 0 16 16"
								aria-hidden="true"><path d="M2.5 13.5 13.5 2.5M5 2.5h8.5V11" /></svg>
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
	</Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import {
	acceptAll,
	acceptSelected,
	closeConsentDialog,
	consentState as state,
	formatConsentDate,
	hasConsent,
	initConsent,
	openConsentDialog,
	rejectAll,
	revokeConsent,
	type ConsentCategory,
	type ConsentTab,
} from '~/libs/consent';
import { COOKIE_ABOUT, COOKIE_CATEGORIES, CONSENT_INTRO, type CookieProvider } from '~/libs/data/cookies';

withDefaults(defineProps<{ position?: 'right' | 'left' }>(), { position: 'right' });

const TABS: { key: ConsentTab; label: string; short?: string }[] = [
	{ key: 'consent', label: 'Consenso' },
	{ key: 'details', label: 'Dettagli' },
	{ key: 'about', label: 'Informazioni cookies', short: 'Info cookie' },
];

// popup status grid: 2 columns -> Necessari / Statistiche, Preferenze / Marketing
const STATUS_ORDER: { key: ConsentCategory; label: string }[] = [
	{ key: 'necessary', label: 'Necessari' },
	{ key: 'statistics', label: 'Statistiche' },
	{ key: 'preferences', label: 'Preferenze' },
	{ key: 'marketing', label: 'Marketing' },
];

const detailsOpen = ref(false);
const openCats = reactive<Partial<Record<ConsentCategory, boolean>>>({ necessary: true });
const firstProvider = COOKIE_CATEGORIES[0]?.providers[0];
const openProviders = reactive<Record<string, boolean>>(
	firstProvider ? { [`${COOKIE_CATEGORIES[0]!.key}:${firstProvider.name}`]: true } : {}
);

const toggleProvider = (id: string) => (openProviders[id] = !openProviders[id]);
const countCookies = (providers: CookieProvider[]) => providers.reduce((n, p) => n + p.cookies.length, 0);

const onKeydown = (e: KeyboardEvent) => {
	if (e.key !== 'Escape') return;
	if (state.dialogOpen) closeConsentDialog();
	else state.popupOpen = false;
};

onMounted(() => {
	initConsent(); // no-op if the plugin already ran
	window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<style lang="scss" scoped>
.cookie-consent {
	--cc-yellow: var(--yellow, #fff615);
	--cc-dark: var(--darkgrey, #2f2c2c);
	--cc-card: var(--lightgrey, #3b3a3a);
	--cc-muted: var(--grey-600, #606060);
	--cc-line: rgb(255 255 255 / 14%);
	--cc-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

button {
	color: inherit;
	background: none;
	border: 0;
	padding: 0;
	cursor: pointer;
}

/* ---------- shared bits ---------- */
// small/tiny text from the site's typography mixins
.cc-small {
	@include p-small;
}

.cc-tiny {
	@include p-tiny;
}

.cc-arrow {
	flex: none;
	width: 14px;
	height: 14px;
	fill: none;
	stroke: currentColor;
	stroke-width: 1.4;
	transition: transform 350ms var(--cc-ease);

	&--bold {
		width: 10px;
		height: 10px;
		stroke-width: 3;
	}
}

.cc-icon-btn {
	display: grid;
	place-items: center;
	width: 28px;
	height: 28px;
	margin: -6px -6px 0 0;

	.cc-arrow {
		width: 18px;
		height: 18px;
	}

	&--yellow {
		color: var(--cc-yellow);
	}
}

// heavy, wide underlined text links (Modifica consenso, Rifiuta, Accetta tutti…)
.cc-link {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	width: max-content;
	font-family: $sans-semi-expanded;
	font-weight: 900;
	font-size: 16px;
	line-height: 1.2;
	letter-spacing: 0.03em;
	text-decoration: underline;
	text-decoration-thickness: 1.5px;
	text-underline-offset: 4px;

	.cc-arrow {
		transition: transform 250ms var(--cc-ease);
	}

	@include hover {
		&:hover .cc-arrow {
			transform: translate(2px, -2px);
		}
	}

	&--muted {
		color: var(--cc-muted);
		transition: color 200ms ease;

		@include hover {
			&:hover {
				color: var(--white, #fff);
			}
		}
	}

	&--accent {
		color: var(--cc-yellow);
	}
}

// height animation without measuring: grid rows 0fr -> 1fr
.cc-collapse {
	display: grid;
	grid-template-rows: 0fr;
	transition: grid-template-rows 400ms var(--cc-ease);

	>div {
		min-height: 0;
		overflow: hidden;
	}

	&.open {
		grid-template-rows: 1fr;
	}
}

.cc-badge {
	display: inline-grid;
	place-items: center;
	min-width: 18px;
	height: 14px;
	padding: 0 4px;
	margin-left: 8px;
	border: 1px solid currentColor;
	border-radius: 3px;
	font-size: 9px;
	line-height: 1;
	opacity: 0.7;
	vertical-align: middle;
}

/* ---------- launcher ---------- */
.cc-widget {
	position: fixed;
	z-index: 2000;
	bottom: 40px;
	right: 24px;

	.cookie-consent--left & {
		right: auto;
		left: 24px;
	}

	@include desktop {
		bottom: 48px;
		right: 40px;

		.cookie-consent--left & {
			left: 40px;
		}
	}
}

.cc-launcher {
	display: grid;
	place-items: center;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background: var(--cc-yellow);
	color: var(--cc-dark);
	box-shadow: 0 6px 20px rgb(0 0 0 / 25%);
	animation: cc-launcher-in 600ms var(--cc-ease) 400ms both;
	transition: transform 300ms var(--cc-ease);

	svg {
		width: 100%;
		height: 100%;
		fill: none;
		stroke: currentColor;
		stroke-width: 15;
	}

	@include hover {
		&:hover {
			transform: scale(1.08);
		}
	}

	&.active {
		box-shadow: 0 0 0 4px rgb(255 246 21 / 25%);
	}
}

@keyframes cc-launcher-in {
	from {
		opacity: 0;
		transform: scale(0.4);
	}
}

/* ---------- status popup ---------- */
.cc-popup {
	position: absolute;
	right: calc(100% + 18px);
	bottom: -16px;
	width: min(352px, calc(100vw - 110px));
	padding: 22px 24px 24px;
	border-radius: 14px 14px 0 14px;
	background: var(--white, #fff);
	color: var(--cc-dark);
	box-shadow: 0 20px 50px rgb(0 0 0 / 30%);
	transform-origin: 100% 100%;

	.cookie-consent--left & {
		right: auto;
		left: calc(100% + 18px);
		border-radius: 14px 14px 14px 0;
		transform-origin: 0 100%;
	}

	&__head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		margin-bottom: 14px;
	}

	&__tail {
		position: absolute;
		bottom: 0;
		left: 100%;
		width: 28px;
		height: 28px;
		margin-left: -1px;
		overflow: visible;

		path {
			fill: var(--white, #fff);
		}

		.cookie-consent--left & {
			left: auto;
			right: 100%;
			margin: 0 -1px 0 0;
			transform: scaleX(-1);
		}
	}
}

.cc-status {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 6px 16px;
	margin: 10px 0 20px;
	padding: 0;
	list-style: none;

	li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
}

.cc-check {
	position: relative;
	flex: none;
	width: 11px;
	height: 11px;
	border: 1px solid var(--cc-muted);
	border-radius: 2px;

	&.checked {
		border-color: var(--cc-dark);
		background: var(--cc-dark);

		&::after {
			content: '';
			position: absolute;
			inset: 2px;
			border-radius: 1px;
			background: var(--cc-yellow);
		}
	}
}

.cc-details {
	border-radius: 8px;
	background: var(--cc-yellow);

	&__toggle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 10px 14px;
		text-align: left;
	}

	&.open &__toggle .cc-arrow {
		transform: rotate(180deg);
	}

	&__list {
		padding: 4px 14px 16px;
		line-height: 1.45;

		dt {
			font-weight: 700;

			&:not(:first-child) {
				margin-top: 14px;
			}
		}

		dd {
			margin: 0;
		}
	}

	.cc-id {
		word-break: break-all;
	}
}

.cc-links {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-top: 22px;
}

.cc-pop-enter-active,
.cc-pop-leave-active {
	transition: opacity 250ms ease, transform 400ms var(--cc-ease);
}

.cc-pop-enter-from,
.cc-pop-leave-to {
	opacity: 0;
	transform: translateY(12px) scale(0.92);
}

/* ---------- dialog ---------- */
.cc-overlay {
	position: fixed;
	z-index: 2001;
	inset: 0;
	display: grid;
	place-items: center;
	padding: 16px;
	background: rgb(0 0 0 / 55%);
	overscroll-behavior: contain;
}

.cc-dialog {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 780px;
	max-height: min(860px, calc(100dvh - 32px));
	padding: 20px;
	border-radius: 14px;
	background: var(--cc-card);
	color: var(--white, #fff);
	box-shadow: 0 30px 80px rgb(0 0 0 / 40%);

	&__body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0 14px;
		scrollbar-width: thin;
		scrollbar-color: var(--cc-muted) transparent;
	}
}

.cc-tabs {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20px;
	margin-bottom: 36px;

	@include mobile {
		gap: 8px;
		margin-bottom: 24px;
	}
}

.cc-tab {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	min-width: 0;
	height: 44px;
	padding: 0 14px;
	border: 1px solid var(--cc-line);
	border-radius: 8px;
	color: var(--cc-muted);
	text-align: left;
	transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;

	span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__short {
		display: none;
	}

	@include mobile {
		.cc-tab__label {
			display: none;
		}

		.cc-tab__short {
			display: block;
		}
	}

	@include mobile {
		height: 40px;
		padding: 0 10px;
		font-size: 13px !important;

		.cc-arrow {
			display: none;
		}
	}

	@include hover {
		&:not(.active):hover {
			color: var(--white, #fff);
		}
	}

	&.active {
		border-color: var(--cc-yellow);
		background: var(--cc-yellow);
		color: var(--cc-dark);
	}
}

.cc-panel {
	animation: cc-panel-in 400ms var(--cc-ease) both;
}

@keyframes cc-panel-in {
	from {
		opacity: 0;
		transform: translateY(8px);
	}
}

.cc-title {
	margin-bottom: 10px;
	color: var(--cc-yellow);
}

.cc-muted {
	color: var(--cc-muted);
}

.cc-options {
	display: flex;
	flex-wrap: wrap;
	gap: 12px 32px;
	margin-top: 24px;
}

.cc-option,
.cc-switch {
	position: relative;
	display: inline-flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;

	input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}

	&:has(input:disabled) {
		cursor: default;
	}

	&:has(input:focus-visible) .cc-box {
		outline: 2px solid var(--cc-yellow);
		outline-offset: 2px;
	}
}

.cc-box {
	position: relative;
	flex: none;
	width: 11px;
	height: 11px;
	border: 1px solid var(--cc-muted);
	border-radius: 2px;
	transition: border-color 200ms ease;

	&::after {
		content: '';
		position: absolute;
		inset: 2px;
		border-radius: 50%;
		background: var(--cc-yellow);
		transform: scale(0);
		transition: transform 250ms var(--cc-ease);
	}

	input:checked+& {
		border-color: var(--cc-yellow);

		&::after {
			transform: scale(1);
		}
	}

	&--big {
		width: 17px;
		height: 17px;
		border-radius: 3px;

		&::after {
			inset: 4px;
		}
	}
}

/* details: categories */
.cc-cat {
	position: relative;
	display: grid;
	grid-template-columns: 1fr auto;
	column-gap: 32px;
	padding: 0 0 24px 32px;

	&+& {
		padding-top: 24px;
		border-top: 1px solid var(--cc-line);
	}

	&__toggle {
		display: flex;
		align-items: center;
		width: max-content;
		color: var(--cc-yellow);
		text-align: left;

		.cc-badge {
			color: var(--cc-yellow);
		}
	}

	&__arrow {
		position: absolute;
		left: 6px;
		width: 14px;
		height: 14px;
		color: var(--cc-yellow);
	}

	&.open &__arrow {
		transform: rotate(90deg);
	}

	.cc-switch {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: center;
	}

	&__desc {
		grid-column: 1;
		margin-top: 4px;
		max-height: 7em;
		overflow: hidden;
		transition: max-height 400ms var(--cc-ease);
	}

	// collapsed: short, fading preview of the description
	&:not(.open) &__desc {
		max-height: 1.6em;
		mask-image: linear-gradient(to bottom, rgb(0 0 0 / 60%), transparent);
	}

	&__body {
		grid-column: 1 / -1;
	}
}

.cc-empty {
	padding-top: 12px;
}

/* details: providers + cookies */
.cc-provider b,
.cc-cookie b {
	font-weight: 700;
}

.cc-provider {
	margin-top: 16px;
	border: 1px solid var(--cc-line);
	border-radius: 8px;
	color: rgb(255 255 255 / 45%);

	&__head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		padding: 12px 14px;

		.cc-icon-btn {
			margin: 0 -4px 0 0;
		}
	}

	&__link {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 200ms ease;

		@include hover {
			&:hover {
				color: var(--white, #fff);
			}
		}
	}

	&__arrow {
		width: 14px !important;
		height: 14px !important;
	}

	&.open &__arrow {
		transform: rotate(90deg);
	}
}

.cc-cookie {
	margin: 0 14px 14px;
	padding: 14px 16px;
	border-radius: 6px;
	background: rgb(255 255 255 / 5%);

	hr {
		margin: 12px 0;
		border: 0;
		border-top: 1px solid var(--cc-line);
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 24px;
	}
}

.cc-about p+p {
	margin-top: 1.1em;
}

.cc-actions {
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 48px 14px 14px;

	@include mobile {
		padding-top: 28px;
	}
}

.cc-dialog-enter-active,
.cc-dialog-leave-active {
	transition: opacity 300ms ease;

	.cc-dialog {
		transition: transform 500ms var(--cc-ease);
	}
}

.cc-dialog-enter-from,
.cc-dialog-leave-to {
	opacity: 0;

	.cc-dialog {
		transform: translateY(24px);
	}
}

@media (prefers-reduced-motion: reduce) {

	.cc-launcher,
	.cc-panel {
		animation: none;
	}
}
</style>
