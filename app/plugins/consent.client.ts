import { initConsent } from '~/libs/consent';

// read the saved choice as early as possible (before other client code checks it)
export default defineNuxtPlugin(() => {
	initConsent();
});
