<template>
  <div class="product-page">
    <!-- Horizontal scrollable container for sections -->
    <div
      ref="sectionsContainer"
      class="sections-container"
      @scroll="handleScroll"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Artisan Section -->
      <section class="section" data-section="artisan">
        <div class="section-content">
          <h2 class="section-title">Artisan</h2>
          <div class="content-items">
            <div v-for="(item, index) in artisanContent" :key="`artisan-${index}`" class="content-item">
              <div v-if="item.type === 'title'">
                <h1>{{ item.content }}</h1>
              </div>
              <div v-else-if="item.type === 'text'">
                <p>{{ item.content }}</p>
              </div>
              <div v-else-if="item.type === 'quote'">
                <blockquote>"{{ item.content }}"</blockquote>
              </div>
              <div v-else-if="item.type === 'image'">
                <img :src="item.content" :alt="item.content" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Section -->
      <section class="section" data-section="product">
        <div class="section-content">
          <h2 class="section-title">Product</h2>
          <div class="content-items">
            <div v-for="(item, index) in productContent" :key="`product-${index}`" class="content-item">
              <div v-if="item.type === 'title'">
                <h1>{{ item.content }}</h1>
              </div>
              <div v-else-if="item.type === 'text'">
                <p>{{ item.content }}</p>
              </div>
              <div v-else-if="item.type === 'quote'">
                <blockquote>"{{ item.content }}"</blockquote>
              </div>
              <div v-else-if="item.type === 'image'">
                <img :src="item.content" :alt="item.content" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How it's made Section -->
      <section class="section" data-section="how-its-made">
        <div class="section-content">
          <h2 class="section-title">How it's made</h2>
          <div class="content-items">
            <div v-for="(item, index) in howItsMadeContent" :key="`how-${index}`" class="content-item">
              <div v-if="item.type === 'title'">
                <h1>{{ item.content }}</h1>
              </div>
              <div v-else-if="item.type === 'text'">
                <p>{{ item.content }}</p>
              </div>
              <div v-else-if="item.type === 'quote'">
                <blockquote>"{{ item.content }}"</blockquote>
              </div>
              <div v-else-if="item.type === 'image'">
                <img :src="item.content" :alt="item.content" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Traceability Section -->
      <section class="section" data-section="traceability">
        <div class="section-content">
          <h2 class="section-title">Traceability</h2>
          <div class="content-items">
            <div v-for="(item, index) in traceabilityContent" :key="`trace-${index}`" class="content-item">
              <div v-if="item.type === 'title'">
                <h1>{{ item.content }}</h1>
              </div>
              <div v-else-if="item.type === 'text'">
                <p>{{ item.content }}</p>
              </div>
              <div v-else-if="item.type === 'quote'">
                <blockquote>"{{ item.content }}"</blockquote>
              </div>
              <div v-else-if="item.type === 'image'">
                <img :src="item.content" :alt="item.content" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Fixed bottom tab navigation -->
    <nav class="tab-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="scrollToSection(tab.id)"
      >
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useProductsStore } from '@/stores/productsStore'

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

const product = computed(() => getProduct(props.id))
const sectionsContainer = ref(null)
const activeTab = ref('artisan')

// Touch/swipe handling
const touchStartX = ref(0)
const touchStartY = ref(0)
const isScrolling = ref(false)

const tabs = [
  { id: 'artisan', label: 'Artisan' },
  { id: 'product', label: 'Product' },
  { id: 'how-its-made', label: "How it's made" },
  { id: 'traceability', label: 'Traceability' },
]

// Content for each section
const artisanContent = computed(() => {
  if (product.value?.maker?.content) {
    return product.value.maker.content
  }
  return [
    { type: 'text', content: 'Meet our skilled artisan who creates beautiful products using traditional techniques and local materials.' },
    { type: 'image', content: 'https://fastly.picsum.photos/id/744/400/300.jpg?hmac=QB_puLFiEKiOkiVJXMeY6ie3KJ4AgggamJiRa4kobOo' },
    { type: 'quote', content: 'Craftsmanship is not just about making things, it\'s about preserving traditions and creating something meaningful.' },
    { type: 'text', content: 'With years of experience and a passion for quality, our artisan ensures every product meets the highest standards.' },
  ]
})

const productContent = computed(() => {
  if (product.value?.product?.content) {
    return product.value.product.content
  }
  return [
    { type: 'text', content: 'Discover the unique features and qualities of this exceptional product.' },
    { type: 'image', content: 'https://fastly.picsum.photos/id/744/400/300.jpg?hmac=QB_puLFiEKiOkiVJXMeY6ie3KJ4AgggamJiRa4kobOo' },
    { type: 'text', content: 'Each piece is carefully crafted to ensure durability, beauty, and functionality.' },
  ]
})

const howItsMadeContent = computed(() => {
  return [
    { type: 'title', content: 'The Process' },
    { type: 'text', content: 'Our products are made using time-honored techniques passed down through generations.' },
    { type: 'image', content: 'https://fastly.picsum.photos/id/744/400/300.jpg?hmac=QB_puLFiEKiOkiVJXMeY6ie3KJ4AgggamJiRa4kobOo' },
    { type: 'text', content: 'Step 1: Selection of premium materials from local sources.' },
    { type: 'text', content: 'Step 2: Preparation and treatment of materials using traditional methods.' },
    { type: 'image', content: 'https://fastly.picsum.photos/id/744/400/300.jpg?hmac=QB_puLFiEKiOkiVJXMeY6ie3KJ4AgggamJiRa4kobOo' },
    { type: 'text', content: 'Step 3: Handcrafting by skilled artisans with attention to detail.' },
    { type: 'text', content: 'Step 4: Quality inspection and finishing touches.' },
    { type: 'quote', content: 'Every step is performed with care and dedication to create something truly special.' },
  ]
})

const traceabilityContent = computed(() => {
  return [
    { type: 'title', content: 'Full Transparency' },
    { type: 'text', content: 'We believe in complete transparency about the origin and journey of our products.' },
    { type: 'image', content: 'https://fastly.picsum.photos/id/744/400/300.jpg?hmac=QB_puLFiEKiOkiVJXMeY6ie3KJ4AgggamJiRa4kobOo' },
    { type: 'text', content: 'Origin: Sourced from local suppliers committed to sustainable practices.' },
    { type: 'text', content: 'Production: Handcrafted in our workshop using traditional techniques.' },
    { type: 'text', content: 'Quality Assurance: Each product undergoes rigorous quality checks.' },
    { type: 'image', content: 'https://fastly.picsum.photos/id/744/400/300.jpg?hmac=QB_puLFiEKiOkiVJXMeY6ie3KJ4AgggamJiRa4kobOo' },
    { type: 'text', content: 'Certification: Our products meet international quality and sustainability standards.' },
    { type: 'quote', content: 'Know exactly where your product comes from and how it was made.' },
  ]
})

// Scroll to specific section
const scrollToSection = (sectionId) => {
  if (!sectionsContainer.value) return

  const section = sectionsContainer.value.querySelector(`[data-section="${sectionId}"]`)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    activeTab.value = sectionId
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
      // Ensure we start at the first section
      scrollToSection('artisan')
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
  padding: 2rem 1.5rem 5rem; // Extra bottom padding for fixed nav
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;

  @media (min-width: 768px) {
    padding: 3rem 2rem 6rem;
  }
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

.content-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
    color: #222;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
    color: #555;
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
    color: #444;
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
    border-radius: 8px;
    display: block;
    margin: 1rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;

    @media (min-width: 768px) {
      margin: 1.5rem 0;
      border-radius: 12px;
    }
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
  color: #666;
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
</style>
