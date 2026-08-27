<template>
    <storyblok-wrapper :url="`servizi/${$route.params.slug}`">
        <template #default="{ story, refreshKey }">
            <main :key="refreshKey"
                class="page-service">
                <div class="layout-block">
                    <layout-text-hero />
                    <storyblok-map :bloks="story.content.body"
                        :refresh-key="refreshKey" />
                    <!--
                    <layout-text-hero />
                    <layout-three-columns />
                    <layout-text-list />
                    <layout-large-text />
                    <layout-media-marquee />
                    -->
                </div>
            </main>
        </template>
    </storyblok-wrapper>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.page-service {
    position: relative;
    padding-top: var(--header-height);


    >div {
        display: flex;
        flex-direction: column;
        gap: var(--spacer-64);

        @include desktop {
            gap: var(--spacer-128);
        }
    }

    section {
        &:last-child {
            margin-bottom: var(--spacer-64);

            @include desktop {
                margin-bottom: var(--spacer-128);
            }
        }
    }

}
</style>
