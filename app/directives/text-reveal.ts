import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import type { DirectiveBinding } from 'vue';
import { GSAPDuration, GSAPEase } from '~/libs/constants/gsap';

export default {
    async mounted(el: HTMLElement, binding: DirectiveBinding) {
        await nextTick();
        const opacity = binding.value?.opacity || 0.1;
        const start = binding.value?.start || 'top 95%';
        const end = binding.value?.end || 'bottom 80%';

        // context collects the tween + its ScrollTrigger so revert() fully cleans up
        const ctx = gsap.context(() => {
            const $st = new SplitText(el, { type: 'words' });

            gsap.set($st.words, { opacity });
            gsap.to($st.words, {
                opacity: 1,
                duration: GSAPDuration.DEFAULT,
                ease: GSAPEase.SLOW_IN_OUT,
                stagger: 1 / $st.words.length,
                scrollTrigger: {
                    trigger: el,
                    start,
                    end,
                    scrub: 1,
                },
            });
        });

        (el as any).__cleanup = () => ctx.revert();
    },
    beforeUnmount(el: HTMLElement) {
        (el as any).__cleanup?.();
    },
    getSSRProps() {
        // you can provide SSR-specific props here
        return {};
    },
};
