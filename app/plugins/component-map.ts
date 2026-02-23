import ALink from '~/components/common/ui/link/ALink.vue'
import Arrow from '~/components/common/ui/arrow/Arrow.vue'
import Ham from '~/components/common/ui/ham/Ham.vue'

import Services from '~/components/common/layout/Services.vue'
import Stories from '~/components/common/layout/Stories.vue'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('a-link', ALink)
    nuxtApp.vueApp.component('ui-arrow', Arrow)
    nuxtApp.vueApp.component('ui-ham', Ham)

    nuxtApp.vueApp.component('layout-services', Services)
    nuxtApp.vueApp.component('layout-stories', Stories)
})

