<template>
  <section class="layout-blog-box">
    <div class="layout-blog-box__inner layout-grid">
      <div class="content">
        <div class="title display">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </div>
        <div class="p --grey">
          <storyblok-richtext :content="blok.description[0].text"
            cleanup />
        </div>
        <a-link :href="resolveLink(blok.global_link[0].link)">
          <div class="p cta">
            <span>
              {{ blok.global_link[0].label }}
            </span>
            <ui-arrow />
          </div>
        </a-link>
      </div>
      <div>
        <ui-blog-card-item :blok="blok.articles[0]" />
      </div>
      <div>
        <ui-blog-card-item :blok="blok.articles[1]" />
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { DATA_ARTICLE_BLOCK } from '~/libs/data';
import { resolveLink } from '~/libs/storyblok/utils';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_ARTICLE_BLOCK
  }
})


</script>

<style lang="scss" scoped>
.layout-blog-box {
  position: relative;
  background-color: var(--lightgrey);
  padding: var(--spacer-32);
  border-radius: var(--spacer-16);

  &__inner {
    position: relative;
    grid-template-columns: repeat(1, 1fr);

    @include desktop {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-16);

    @include desktop {
      padding-right: var(--spacer-32);
    }

    .cta {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--spacer-8);
      margin-top: var(--spacer-32);

      &:deep(.ui-arrow) {
        transition: all 250ms var(--ease-in-out-quint);
      }

      @include hover {
        &:hover {
          span {
            color: var(--yellow);
          }

          &:deep(.ui-arrow) {
            transform: translate(2px, -2px)
          }
        }
      }
    }
  }

}
</style>
