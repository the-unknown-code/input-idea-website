/**
 * Cookie consent store (client-side, framework-light so it can be used anywhere).
 *
 * - The choice is saved in the first-party cookie `ii_consent` for 1 year
 *   (declared in libs/data/cookies.ts as a "Necessari" cookie).
 * - Every saved choice gets a consent ID + date (shown in the banner).
 * - Google Consent Mode v2 signals are pushed to `window.dataLayer`, so GTM/GA
 *   can be added later and will respect the choice automatically.
 *
 * Usage in components:  const { state, hasConsent } = useConsent()
 *                       hasConsent('marketing')  -> boolean (reactive)
 * Other scripts:        window.addEventListener('consent:update', e => e.detail)
 */
import { reactive } from 'vue';

export type ConsentCategory = 'necessary' | 'preferences' | 'statistics' | 'marketing';
export type ConsentChoice = Record<ConsentCategory, boolean>;
export type ConsentRecord = ConsentChoice & { id: string; date: string; version: number };
export type ConsentTab = 'consent' | 'details' | 'about';

export const CONSENT_COOKIE = 'ii_consent';
// bump when the cookie declaration changes in a way that needs a new consent
const CONSENT_VERSION = 1;
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const CONSENT_CATEGORIES: ConsentCategory[] = ['necessary', 'preferences', 'statistics', 'marketing'];

const NONE: ConsentChoice = { necessary: true, preferences: false, statistics: false, marketing: false };
const ALL: ConsentChoice = { necessary: true, preferences: true, statistics: true, marketing: true };

export const consentState = reactive({
	ready: false,
	record: null as ConsentRecord | null,
	// working copy edited in the dialog (checkboxes / toggles)
	draft: { ...NONE } as ConsentChoice,
	popupOpen: false,
	dialogOpen: false,
	dialogTab: 'consent' as ConsentTab,
});

/* ---------- cookie io ---------- */
const readCookie = (): ConsentRecord | null => {
	const raw = document.cookie.split('; ').find(c => c.startsWith(`${CONSENT_COOKIE}=`));
	if (!raw) return null;
	try {
		const parsed = JSON.parse(decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1)));
		return parsed?.version === CONSENT_VERSION && parsed.id ? { ...parsed, necessary: true } : null;
	} catch {
		return null;
	}
};

const writeCookie = (record: ConsentRecord) => {
	const secure = location.protocol === 'https:' ? '; Secure' : '';
	document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
};

const newConsentId = () => {
	const bytes = crypto.getRandomValues(new Uint8Array(33));
	return btoa(String.fromCharCode(...bytes));
};

/* ---------- Google Consent Mode v2 (no-op until GTM/GA is added) ---------- */
const gtag = (...args: unknown[]) => {
	const w = window as any;
	w.dataLayer = w.dataLayer || [];
	w.dataLayer.push(args);
};

const toGoogleConsent = (c: ConsentChoice) => {
	const v = (on: boolean) => (on ? 'granted' : 'denied');
	return {
		ad_storage: v(c.marketing),
		ad_user_data: v(c.marketing),
		ad_personalization: v(c.marketing),
		analytics_storage: v(c.statistics),
		functionality_storage: v(c.preferences),
		personalization_storage: v(c.preferences),
		security_storage: 'granted',
	};
};

const broadcast = (record: ConsentRecord) => {
	gtag('consent', 'update', toGoogleConsent(record));
	(window as any).dataLayer.push({ event: 'cookie_consent_update', consent: { ...record } });
	window.dispatchEvent(new CustomEvent('consent:update', { detail: { ...record } }));
};

/* ---------- public api ---------- */
export const initConsent = () => {
	if (consentState.ready || typeof window === 'undefined') return;
	gtag('consent', 'default', { ...toGoogleConsent(NONE), wait_for_update: 500 });

	const record = readCookie();
	consentState.record = record;
	consentState.draft = { ...(record ?? NONE) };
	consentState.ready = true;

	// nothing opens by itself: the visitor uses the launcher (popup -> "Modifica consenso")
	if (record) broadcast(record);
};

export const saveConsent = (choice: Partial<ConsentChoice>) => {
	const record: ConsentRecord = {
		...NONE,
		...choice,
		necessary: true,
		id: newConsentId(),
		date: new Date().toISOString(),
		version: CONSENT_VERSION,
	};
	writeCookie(record);
	consentState.record = record;
	consentState.draft = { ...record };
	consentState.dialogOpen = false;
	consentState.popupOpen = false;
	broadcast(record);
};

export const acceptAll = () => saveConsent(ALL);
export const rejectAll = () => saveConsent(NONE);
export const acceptSelected = () => saveConsent(consentState.draft);

/** Withdraw: keep only necessary cookies, then ask again. */
export const revokeConsent = () => {
	saveConsent(NONE);
	openConsentDialog('consent');
};

export const openConsentDialog = (tab: ConsentTab = 'consent') => {
	consentState.draft = { ...(consentState.record ?? NONE) };
	consentState.dialogTab = tab;
	consentState.popupOpen = false;
	consentState.dialogOpen = true;
};

export const closeConsentDialog = () => {
	consentState.dialogOpen = false;
};

export const hasConsent = (category: ConsentCategory) =>
	category === 'necessary' || !!consentState.record?.[category];

export const formatConsentDate = (iso: string) => {
	const d = new Date(iso);
	const date = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
	const time = new Intl.DateTimeFormat('it-IT', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short',
	}).format(d);
	return `${date} - ${time}`;
};

export const useConsent = () => ({
	state: consentState,
	hasConsent,
	saveConsent,
	acceptAll,
	rejectAll,
	acceptSelected,
	revokeConsent,
	openConsentDialog,
	closeConsentDialog,
});
