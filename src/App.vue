<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <div class="app">
    <Header />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--color-surface-base, #ffffff);
  color: var(--color-text-primary, #2d2d2d);
}

@media (prefers-color-scheme: dark) {
  .app {
    background: var(--color-surface-base, #212121);
    color: var(--color-text-primary, #ffffff);
  }
}
</style>