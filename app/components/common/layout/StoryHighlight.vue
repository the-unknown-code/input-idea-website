<template>
  <section class="layout-story-highlight">
    <div class="layout-story-highlight__content layout-grid">
      <div>
        <div v-text-reveal
          class="h2">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </div>
      </div>
      <div>
        <div v-for="(item, i) in blok.list"
          :key="i"
          :class="['highlight', { last: i === blok.list.length - 1 }]">
          <template v-if="Number(i) < blok.list.length - 1">
            <div>
              <p class="--black">{{ item.title }}</p>
            </div>
            <a-link class="cta"
              :href="resolveLink(item.cta[0].link)">
              <ui-arrow />
            </a-link>

          </template>
          <template v-else>
            <div class="media">
              <common-media :src="storyblokFormat(item.media[0].image.filename, 640)"
                cover />
            </div>
            <div class="content">
              <p class="p-big --yellow">{{ item.title }}</p>
              <p class="p-tiny --white">{{ item.description }}</p>
              <a-link :href="resolveLink(item.cta[0].link)"
                class="cta p --yellow">
                <span>{{ item.cta[0].label }}</span>
                <ui-arrow />
              </a-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TEXT_CAROUSEL } from '~/libs/data';
import { resolveLink, storyblokFormat } from '~/libs/storyblok/utils';



const { blok } = defineProps({
  blok: {
    type: Object,
    required: false,
    default: TEXT_CAROUSEL
  }
})

</script>

<style lang="scss" scoped>
.layout-story-highlight {
  position: relative;

  &__content {
    >div {
      display: flex;
      grid-column: -1 / 1;

      &:nth-child(1) {
        @include desktop {
          grid-column: span 4;
          align-items: center;

          .h1 {
            padding-right: 24px;
          }
        }
      }

      &:nth-child(2) {
        flex-direction: column;
        gap: 16px;

        @include desktop {
          flex-direction: row;
          grid-column: span 8;
          align-items: flex-start;
        }
      }
    }
  }

  .h2 {
    @include mobile {
      margin-bottom: 16px;
    }
  }

  .highlight {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    overflow: hidden;
    border-radius: 16px;
    padding: 24px;
    background-color: var(--yellow);


    @include desktop {
      flex-direction: column;
      width: 16.66%;
      height: 420px;
      flex-grow: 1;

      &:not(.last) {
        p {
          position: relative;
          white-space: nowrap;
          writing-mode: horizontal-tb;
          white-space: nowrap;
          transform: rotate(90deg);
          transform-origin: top left;
          left: 16px;
        }
      }

      &.last {
        width: 50%;
      }
    }

    &:deep(path) {
      fill: var(--black);
    }

    &:deep(.cta) {
      &:hover {
        .ui-arrow {
          transform: translate(4px, -4px);
        }
      }
    }

    &.last {
      background-color: var(--black);
      aspect-ratio: 2.5;
    }

    .media {
      position: absolute;
      left: -1%;
      top: -1%;
      width: 102%;
      height: 102%;
      opacity: .7;
    }

    &:deep(.ui-arrow) {
      transition: transform .3s var(--ease-in-out-circ);
    }


    .content {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 16px;

      .cta {
        display: flex;
        flex-direction: row;
        gap: 16px;
        cursor: pointer;

      }

      &:deep(path) {
        fill: var(--yellow);
      }

    }

  }
}
</style>
