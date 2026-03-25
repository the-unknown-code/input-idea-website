import ALink from '~/components/common/ui/link/ALink.vue'
import Arrow from '~/components/common/ui/arrow/Arrow.vue'
import Ham from '~/components/common/ui/ham/Ham.vue'
import BlogCardItem from '~/components/common/ui/blog/BlogCardItem.vue'

import Services from '~/components/common/layout/Services.vue'
import Stories from '~/components/common/layout/Stories.vue'
import LogoMarquee from '~/components/common/layout/LogoMarquee.vue'
import BlogBox from '~/components/common/layout/BlogBox.vue'
import ProjectHero from '~/components/common/layout/ProjectHero.vue'
import ProjectGridBlock from '~/components/common/layout/ProjectGridBlock.vue'
import TextList from '~/components/common/layout/TextList.vue'
import MediaCarousel from '~/components/common/layout/MediaCarousel.vue'


export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('a-link', ALink)
    nuxtApp.vueApp.component('ui-arrow', Arrow)
    nuxtApp.vueApp.component('ui-ham', Ham)
    nuxtApp.vueApp.component('ui-blog-card-item', BlogCardItem)

    nuxtApp.vueApp.component('layout-services', Services)
    nuxtApp.vueApp.component('layout-stories', Stories)
    nuxtApp.vueApp.component('layout-logo-marquee', LogoMarquee)
    nuxtApp.vueApp.component('layout-blog-box', BlogBox)
    nuxtApp.vueApp.component('layout-project-hero', ProjectHero)
    nuxtApp.vueApp.component('layout-project-grid-block', ProjectGridBlock)
    nuxtApp.vueApp.component('layout-text-list', TextList)
    nuxtApp.vueApp.component('layout-media-carousel', MediaCarousel)


})

