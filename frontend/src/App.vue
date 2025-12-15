<script setup></script>

<template>
  <header>
    <a href="/">
      <img src="/proveniawhite.svg" alt="Provenia" height="40"/>
    </a>
  </header>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">

$primary-color: #42b983;

header {
  max-width: 560px;
  margin: 0 auto;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: black;
  text-align: center;
  a {
    font-family: "Radley", serif;
    text-align: center;
    padding: 0.5rem 1rem;
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    display: inline-block;
  }
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
