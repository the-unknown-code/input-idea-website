<template>
    <storyblok-wrapper :url="`progetti/${$route.params.slug}`">
        <template #default="{ story, refreshKey }">
            <main :key="refreshKey"
                class="page-project">
                <div class="layout-block">


                    <storyblok-map :bloks="story.content.body"
                        :refresh-key="refreshKey" />

                    <!--
                    <layout-project-hero />
                    <layout-project-grid-block />
                    <layout-text-list />
                    <layout-media-carousel />
                    <layout-link-list />
                    -->
                </div>
            </main>
        </template>
    </storyblok-wrapper>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.page-project {
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
