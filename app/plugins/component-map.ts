import ALink from '~/components/common/ui/link/ALink.vue'
import Arrow from '~/components/common/ui/arrow/Arrow.vue'
import Ham from '~/components/common/ui/ham/Ham.vue'
import BlogCardItem from '~/components/common/ui/blog/BlogCardItem.vue'
import FormInput from '~/components/common/ui/form/Input.vue'

import Services from '~/components/common/layout/Services.vue'
import Stories from '~/components/common/layout/Stories.vue'
import LogoMarquee from '~/components/common/layout/LogoMarquee.vue'
import BlogBox from '~/components/common/layout/BlogBox.vue'
import ProjectHero from '~/components/common/layout/ProjectHero.vue'
import ProjectGridBlock from '~/components/common/layout/ProjectGridBlock.vue'
import TextList from '~/components/common/layout/TextList.vue'
import MediaCarousel from '~/components/common/layout/MediaCarousel.vue'
import LinkList from '~/components/common/layout/LinkList.vue'
import TextHero from '~/components/common/layout/TextHero.vue'
import ClaimHero from '~/components/common/layout/ClaimHero.vue'
import FocusText from '~/components/common/layout/FocusText.vue'
import FocusItem from '~/components/common/layout/FocusItem.vue'
import Form from '~/components/common/layout/Form.vue'
import ThreeColumns from '~/components/common/layout/ThreeColumns.vue'
import LargeText from '~/components/common/layout/LargeText.vue'
import MediaMarquee from '~/components/common/layout/MediaMarquee.vue'
import CaseHistory from '~/components/common/layout/CaseHistory.vue'
import TextCarousel from '~/components/common/layout/TextCarousel.vue'
import StoryHighlight from '~/components/common/layout/StoryHighlight.vue'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('a-link', ALink)
    nuxtApp.vueApp.component('ui-arrow', Arrow)
    nuxtApp.vueApp.component('ui-ham', Ham)
    nuxtApp.vueApp.component('ui-blog-card-item', BlogCardItem)
    nuxtApp.vueApp.component('ui-form-input', FormInput)

    nuxtApp.vueApp.component('layout-services', Services)
    nuxtApp.vueApp.component('layout-stories', Stories)
    nuxtApp.vueApp.component('layout-logo-marquee', LogoMarquee)
    nuxtApp.vueApp.component('layout-blog-box', BlogBox)
    nuxtApp.vueApp.component('layout-project-hero', ProjectHero)
    nuxtApp.vueApp.component('layout-project-grid-block', ProjectGridBlock)
    nuxtApp.vueApp.component('layout-text-list', TextList)
    nuxtApp.vueApp.component('layout-media-carousel', MediaCarousel)
    nuxtApp.vueApp.component('layout-link-list', LinkList)
    nuxtApp.vueApp.component('layout-text-hero', TextHero)
    nuxtApp.vueApp.component('layout-claim-hero', ClaimHero)
    nuxtApp.vueApp.component('layout-focus-text', FocusText)
    nuxtApp.vueApp.component('layout-focus-item', FocusItem)
    nuxtApp.vueApp.component('layout-form', Form)
    nuxtApp.vueApp.component('layout-three-columns', ThreeColumns)
    nuxtApp.vueApp.component('layout-large-text', LargeText)
    nuxtApp.vueApp.component('layout-media-marquee', MediaMarquee)
    nuxtApp.vueApp.component('layout-case-history', CaseHistory)
    nuxtApp.vueApp.component('layout-text-carousel', TextCarousel)
    nuxtApp.vueApp.component('layout-story-highlight', StoryHighlight)

})

