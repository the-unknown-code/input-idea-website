import textReveal from '~/directives/text-reveal';
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive('text-reveal', textReveal);
});
