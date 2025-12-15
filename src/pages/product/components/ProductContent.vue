<template>

  <div class="content-items">
    <div
      v-for="(item, index) in content"
      :key="`artisan-${index}`"
      :ref="el => setItemRef(el, index)"
      :class="['content-item', { 'is-visible': visibleItems.has(index) }]"
    >
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
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  content: {
    type: Array,
    required: true,
  },
})

const visibleItems = ref(new Set())
const itemRefs = ref([])

const setItemRef = (el, index) => {
  if (el) {
    itemRefs.value[index] = el
  }
}

let observers = []

onMounted(() => {
  // Create Intersection Observer for each item
  itemRefs.value.forEach((item, index) => {
    if (!item) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleItems.value.add(index)
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of item is visible
        rootMargin: '0px 0px -50px 0px', // Start animation slightly before item enters viewport
      }
    )

    observer.observe(item)
    observers.push(observer)
  })
})

onUnmounted(() => {
  // Clean up observers
  observers.forEach((observer) => observer.disconnect())
  observers = []
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
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

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
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: scale(1.01);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}

.padded-section-item {
  padding: 0 0.5rem;
}

</style>
