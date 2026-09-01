<template>
  <section class="layout-ordered-list">
    <div class="layout-ordered-list__content">
      <h2>
        <storyblok-richtext :content="blok.title[0].text"
          cleanup />
      </h2>
      <p v-if="blok.description.length"
        class="--yellow">{{ blok.description }}
      </p>

      <ol>
        <li v-for="item in blok.list"
          :key="item._uid">
          <p v-text-reveal
            class="--grey">
            <storyblok-richtext :content="item.text"
              cleanup />
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>


<script setup lang="ts">


defineProps({
  blok: {
    type: Object,
    required: true,
  }
})
</script>

<style lang="scss" scoped>
.layout-ordered-list {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;


  &__content {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

  }

  ol {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 16px;

    li {
      position: relative;
      width: 100%;
      border-top: 1px solid var(--grey-10);
      text-align: center;
      padding: 8px 0;
      text-wrap: balance;

      &:last-child {
        border-bottom: 1px solid var(--grey-10);
      }
    }
  }
}
</style>
