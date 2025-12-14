<template>

  <div class="content-items">
    this is the reusable component
    <div v-for="(item, index) in content" :key="`artisan-${index}`" class="content-item">
      <div v-if="item.type === 'title'" class="padded-section-item">
        <h1>{{ item.content }}</h1>
      </div>
      <div v-else-if="item.type === 'text'" class="padded-section-item">
        <p>{{ item.content }}</p>
      </div>
      <div v-else-if="item.type === 'quote'" class="padded-section-item">
        <blockquote>"{{ item.content }}"</blockquote>
      </div>
      <div v-else-if="item.type === 'image'">
        <img :src="item.content" :alt="item.content" />
      </div>
    </div>
  </div>

</template>

<script setup>
  const props = defineProps({
    content: {
      type: Array,
      required: true,
    },
  })
</script>

<style scoped lang="scss">
.content-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0;

  @media (min-width: 768px) {
    gap: 2rem;
  }
}


.content-item {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1rem;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;

    @media (min-width: 768px) {
      font-size: 1.125rem;
      line-height: 1.7;
    }
  }

  blockquote {
    font-size: 1.125rem;
    font-style: italic;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: #f5f5f5;
    border-left: 4px solid #333;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
    box-sizing: border-box;

    @media (min-width: 768px) {
      font-size: 1.25rem;
      padding: 2rem;
      margin: 2rem 0;
    }
  }

  img {
    max-width: 100%;
    width: 100%;
    height: auto;
    display: block;
    margin: 1rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }
}

</style>
