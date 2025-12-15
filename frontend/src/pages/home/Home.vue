<template>
  <div class="home-page">
    <h1>Take the <span>story</span> home</h1>
    <p>
      Provenia lets you take not only the product, but the story behind it.
    </p>

    <p>
      We help passionate artisans and designers in Costa Rica 🇨🇷 to tell their story.
    </p>

    <p>
      Every souvenir is a story, and every story is a memory.
    </p>

    <RouterLink to="/p/test" class="test-product-link">Test product</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  gap: 1rem;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  span {
    font-family: 'Radley', serif;
    font-style: italic;
    font-size: 2.5rem;
  }
}
</style>
