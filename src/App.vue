<!-- src/App.vue -->
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <h1>VibeConnect - Conference App</h1>
      <nav style="display: flex; gap: 1rem; margin-bottom: 1rem;">
        <RouterLink to="/">Übersicht</RouterLink>
        <RouterLink to="/my-program">Mein Programm</RouterLink>
      </nav>
    </header>

    <main>
      <!-- Hier rendert der Router dynamisch die aufgerufene Seite hinein -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
  h1 {
    font-size: 2em;
    color: #850c54;
    text-align: center;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #dedede;
    min-height: 100vh;
  }
</style>