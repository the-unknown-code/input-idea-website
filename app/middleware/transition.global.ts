import gsap from 'gsap/all';
import { GSAPDuration, GSAPEase } from '~/libs/constants/gsap';

export default defineNuxtRouteMiddleware(async (to, from) => {
	const equalPath: boolean = to.fullPath === from.fullPath;

	await new Promise<void>(resolve => {
		if (import.meta.client) {
			gsap.to('#page-transition', {
				opacity: equalPath ? 0 : 1,
				duration: GSAPDuration.FAST,
				ease: GSAPEase.SLOW_IN_OUT,
				onComplete: resolve,
			});
		} else {
			resolve();
		}
	});
});
