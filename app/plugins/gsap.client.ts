import gsap from 'gsap';
// import { ScrollTrigger, SplitText, TextPlugin, SlowMo } from 'gsap/all';
import Tempus from 'tempus';

export default defineNuxtPlugin(() => {
	// gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText, SlowMo);
	gsap.defaults({ ease: 'none' });

	// merge rafs
	gsap.ticker.lagSmoothing(0);
	gsap.ticker.remove(gsap.updateRoot);
	Tempus?.add(
		(time) => {
			gsap.updateRoot(time / 1000);
		},
		{ priority: 0 }
	);
});
