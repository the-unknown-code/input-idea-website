<template>
  <a-link :href="resolveLink('https://www.google.com')"
    class="ui-blog-card-item">
    <div class="media">
      <common-media :src="storyblokFormat(getMedia(blok.image[0]).image.src, 640)"
        cover />
    </div>
    <div class="content">

      <div class="eyebrow">
        <span class="p-tiny">{{ blok.category }}</span>
        <span class="p-tiny read --yellow">{{ blok.read_time }} Min.</span>
      </div>
      <div class="title --yellow">
        <p class="p">
          <span>{{ blok.image[0].title }}</span>&nbsp;
          <ui-arrow />
        </p>
      </div>
      <div class="description">
        <p class="p-tiny --grey">
          {{ blok.image[0].description }}
        </p>
      </div>
    </div>
  </a-link>
</template>

<script setup lang="ts">
import { getMedia, resolveLink, storyblokFormat } from '~/libs/storyblok/utils';

defineProps({
  blok: {
    type: Object,
    required: true,
  }
})

</script>


<style lang="scss" scoped>
.ui-blog-card-item {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-8);

  @include mobile {
    margin-bottom: var(--spacer-16);
  }

  @include hover {
    &:hover {
      &:deep(.common-media) {
        transform: scale(1.05);
      }
    }
  }

  .media {
    position: relative;
    width: 100%;
    aspect-ratio: 275 / 136;
    border-radius: var(--spacer-16);
    overflow: hidden;

    &:deep(.common-media) {
      transition: all 450ms var(--ease-in-out-cubic);
    }
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--spacer-16);
    padding: 0 var(--spacer-16);

  }

  .eyebrow {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      position: relative;

      &.read {
        padding: 4px;
        border-radius: var(--spacer-4);
        border: 1px solid var(--yellow);
      }
    }
  }

  .title {
    margin-top: var(--spacer-8);

    @include desktop {
      padding-right: var(--spacer-32);
    }

    p {
      >* {
        display: inline;
      }
    }
  }

  .description {
    p {
      @include line-clamp(2);
    }
  }
}
</style>
