<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand">VibeConnect</RouterLink>

      <nav class="nav" aria-label="Main navigation">
        <RouterLink to="/">Sessions</RouterLink>
        <RouterLink to="/program">My Program</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  background: var(--color-brand-primary, #850c54);
  color: var(--color-text-on-brand, #ffffff);
}

.header-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  max-width: 800px;
  margin: 0 auto;
  padding: 14px 16px;
}

.brand {
  color: inherit;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav a {
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  color: inherit;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
}
.nav a.router-link-exact-active {
  border-bottom-color: currentColor;
}

.brand:focus-visible,
.nav a:focus-visible {
  outline: 2px solid var(--color-text-on-brand, #ffffff);
  outline-offset: 3px;
}
</style>