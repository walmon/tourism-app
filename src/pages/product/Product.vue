<template>
  <div class="product-page">
    <!-- Horizontal scrollable container for sections -->
    <div ref="sectionsContainer" class="sections-container" @scroll="handleScroll" @touchstart="handleTouchStart"
      @touchmove="handleTouchMove" @touchend="handleTouchEnd">
      <!-- Artisan Section -->
      <section class="section" data-section="artisan">
        <div class="section-content">
          <div class="maker-info-wrapper">
            <div class="maker-info">
              <span v-if="maker.profession === PROFESSIONS.ARTISAN">Handcrafted by</span>
              <h2>{{ maker.name }}</h2>
              <p>
                {{ maker.location }}
              </p>
            </div>

            <img class="maker-image" :src="maker.image" :alt="maker.name" />

            <div class="maker-product">
              <h1>{{ product.name }}</h1>
              <p> {{ product.location }}</p>
            </div>
          </div>
          <div class="section-header">
            <p>
              {{ maker.bio }}
            </p>

          </div>

          <ProductContent :content="maker.content" />
        </div>
      </section>

      <!-- Product Section -->
      <section class="section" data-section="product">
        <div class="section-content">
          <div class="product-section-header">
            <img class="product-image" :src="product.image" :alt="product.name" />
            <h2 class="product-name">{{ product.name }}</h2>
            <p> {{ product.location }}</p>
          </div>
          <ProductContent :content="product.content" />
        </div>
      </section>

    </div>

    <!-- Fixed bottom tab navigation -->
    <nav class="tab-navigation">
      <button v-for="tab in tabs" :key="tab.id" :class="['tab-button', { active: activeTab === tab.id }]"
        @click="scrollToSection(tab.id)">
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useProductsStore } from '@/stores/productsStore'
import ProductContent from './components/ProductContent.vue'

const PROFESSIONS = {
  ARTISAN: 'artisan',
  DESIGNER: 'designer',
  ENGINEER: 'engineer',
  OTHER: 'other',
}

// Component name for linting
defineOptions({
  name: 'ProductPage'
})

const { getProduct } = useProductsStore()
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const data = computed(() => getProduct(props.id))
const sectionsContainer = ref(null)
const activeTab = ref(localStorage.getItem('activeTab') || 'artisan')

// Touch/swipe handling
const touchStartX = ref(0)
const touchStartY = ref(0)
const isScrolling = ref(false)

const tabs = [
  { id: 'artisan', label: 'Artisan' },
  { id: 'product', label: 'Product' }
]

const maker = computed(() => {
  return data.value?.maker
})

const product = computed(() => {
  return data.value?.product
})

// Scroll to specific section
const scrollToSection = (sectionId) => {
  if (!sectionsContainer.value) return

  const section = sectionsContainer.value.querySelector(`[data-section="${sectionId}"]`)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    activeTab.value = sectionId
    localStorage.setItem('activeTab', sectionId)
  }
}

// Update active tab based on scroll position
const handleScroll = () => {
  if (!sectionsContainer.value || isScrolling.value) return

  const container = sectionsContainer.value
  const scrollLeft = container.scrollLeft
  const containerWidth = container.clientWidth
  const currentIndex = Math.round(scrollLeft / containerWidth)

  if (tabs[currentIndex]) {
    activeTab.value = tabs[currentIndex].id
    localStorage.setItem('activeTab', tabs[currentIndex].id)
  }
}

// Touch handlers for swipe navigation
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isScrolling.value = false
}

const handleTouchMove = (e) => {
  if (!touchStartX.value || !touchStartY.value) return

  const touchX = e.touches[0].clientX
  const touchY = e.touches[0].clientY
  const diffX = Math.abs(touchX - touchStartX.value)
  const diffY = Math.abs(touchY - touchStartY.value)

  // Determine if this is a horizontal swipe (for tab navigation)
  // Only mark as horizontal scrolling if horizontal movement is significantly greater
  if (diffX > diffY && diffX > 15) {
    isScrolling.value = true
    // Prevent default to allow smooth horizontal scrolling
    if (diffX > diffY * 1.5) {
      e.preventDefault()
    }
  }
}

const handleTouchEnd = (e) => {
  if (!touchStartX.value) {
    touchStartX.value = 0
    touchStartY.value = 0
    return
  }

  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  const diffX = touchStartX.value - touchEndX
  const diffY = Math.abs(touchEndY - touchStartY.value)
  const threshold = 50

  // Only trigger tab change if horizontal swipe is significant and greater than vertical movement
  if (Math.abs(diffX) > threshold && Math.abs(diffX) > diffY && isScrolling.value) {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.value)
    if (diffX > 0 && currentIndex < tabs.length - 1) {
      // Swipe left - next tab
      scrollToSection(tabs[currentIndex + 1].id)
    } else if (diffX < 0 && currentIndex > 0) {
      // Swipe right - previous tab
      scrollToSection(tabs[currentIndex - 1].id)
    }
  }

  touchStartX.value = 0
  touchStartY.value = 0
  isScrolling.value = false
}

onMounted(() => {
  nextTick(() => {
    if (sectionsContainer.value) {
      // Restore saved tab from localStorage, or default to 'artisan'
      const savedTab = localStorage.getItem('activeTab') || 'artisan'
      scrollToSection(savedTab)
    }
  })
})
</script>

<style scoped lang="scss">
.product-page {
  position: relative;
  width: 100%;
  max-width: 100vw;
  height: calc(100vh - 42px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.maker-info-wrapper {
  position: relative;

}

.maker-info {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.9) 30%,
      rgba(0, 0, 0, 0.8) 60%,
      rgba(0, 0, 0, 0) 100%);
  width: 100%;
  padding: 1rem;
  color: white;

  h2 {
    color: white;
    font-family: "Radley", serif;
    font-style: italic;
    font-size: 2rem;
    margin-bottom: 10px;
  }
}

.maker-product {
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  width: 100%;
  background: linear-gradient(to top,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.9) 30%,
      rgba(0, 0, 0, 0.8) 60%,
      rgba(0, 0, 0, 0) 100%);
  padding: 1rem;

  h1 {
    color: white;
  }
}

.product-name,
.maker-product h1 {
  font-family: "Radley", serif;
  font-style: italic;
  font-size: 2rem;
  margin-bottom: 10px;
}

.maker-image {
  width: 100%;
}

.product-image {
  max-width: 90%;
  margin: 0 auto;
  display: block;
  border-radius: 10px;
}

.sections-container {
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE and Edge
  max-width: 100vw;
  height: 100%;

  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
}

.section {
  min-width: 100%;
  width: 100%;
  max-width: 100vw;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  box-sizing: border-box;
  flex-shrink: 0;
  scroll-behavior: smooth;
}

.section-content {
  padding: 0 0 5rem; // Extra bottom padding for fixed nav
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    padding: 3rem 2rem 6rem;
  }
}


.section-header {
  padding: 0 0.5rem;

}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #333;

  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
  }
}

.tab-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  padding: 0.5rem 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  max-width: 100vw;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 0.75rem 0;
    justify-content: center;
  }
}

.tab-button {
  flex: 1;
  min-width: 0;
  padding: 0.875rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-size: 0.875rem;
  white-space: nowrap;
  box-sizing: border-box;
  max-width: 100%;

  @media (min-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    flex: 0 1 auto;
    min-width: 120px;
  }

  &:hover {
    background: #f5f5f5;
    color: #333;
  }

  &.active {
    color: #333;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #333;
      animation: slideIn 0.3s ease;
    }
  }

  .tab-label {
    display: block;
  }
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

// Smooth transitions
* {
  -webkit-tap-highlight-color: transparent;
}

// Prevent text selection during swipe
.sections-container {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.section {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.product-section-header {
  text-align: center;
  padding-top: 2rem;
}
</style>
