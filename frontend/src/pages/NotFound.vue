<template>
  <div class="not-found">
    <img src="/not found.svg" alt="Not found" width="300" />
    <p>Ups, product not found</p>
    <a href="/">
      <button>Go back to home</button>
    </a>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 42px);
  width: 100%;
  background: #fff;
  color: #000;
  font-family: 'Radley', serif;
}

button {
  background: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}
</style>
