<script setup></script>

<template>
  <header>
    <a href="/">
      Tourism souvenir app
    </a>
  </header>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
// You can now use Sass/SCSS features here
// Variables, nesting, mixins, etc.

$primary-color: #42b983;

header {
  max-width: 560px;
  margin: 0 auto;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
}
.container {
  max-width: 560px;
  margin: 0 auto;
}

h1 {
  color: $primary-color;

  &:hover {
    opacity: 0.8;
  }
}

p {
  margin-top: 1rem;

  a {
    color: $primary-color;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
