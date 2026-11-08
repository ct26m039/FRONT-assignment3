<!-- src/components/BaseMenu.vue -->
<script setup>
import { computed } from 'vue'
import SearchBar from './SearchBar.vue'

const props = defineProps({
  // { query, trackId, day, level, format }
  modelValue: { type: Object, required: true },
  // Alle Optionen als [{ value, label }]
  tracks: { type: Array, default: () => [] },
  days: { type: Array, default: () => [] },
  levels: { type: Array, default: () => [] },
  formats: { type: Array, default: () => [] },
  resultCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
})

const emit = defineEmits(['update:modelValue', 'reset'])

const selects = computed(() => [
  { key: 'trackId', label: 'Track', all: 'Alle Tracks', options: props.tracks },
  { key: 'day', label: 'Tag', all: 'Alle Tage', options: props.days },
  { key: 'level', label: 'Level', all: 'Alle Level', options: props.levels },
  { key: 'format', label: 'Format', all: 'Alle Formate', options: props.formats },
])

const hasFilters = computed(() => Object.values(props.modelValue).some((v) => v !== ''))

const update = (key, value) => emit('update:modelValue', { ...props.modelValue, [key]: value })
</script>

<template>
  <div class="menu">
    <div class="filters" role="search">
      <SearchBar
        id="f-query"
        class="search"
        :model-value="props.modelValue.query"
        @update:model-value="update('query', $event)"
      />

      <div v-for="select in selects" :key="select.key" class="field">
        <label :for="`f-${select.key}`">{{ select.label }}</label>
        <select
          :id="`f-${select.key}`"
          :value="props.modelValue[select.key]"
          @change="update(select.key, $event.target.value)"
        >
          <option value="">{{ select.all }}</option>
          <option v-for="option in select.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="result-bar">
      <p class="count" aria-live="polite">
        {{ props.resultCount }} von {{ props.totalCount }} Sessions
      </p>
      <button v-if="hasFilters" class="reset-btn" type="button" @click="emit('reset')">
        Filter zurücksetzen
      </button>
    </div>
  </div>
</template>

<style scoped>
.menu {
  --c-bg: var(--color-surface-base, #ffffff);
  --c-text: var(--color-text-primary, #2d2d2d);
  --c-accent: var(--color-brand-accent, #da148a);

  /* Kein Token vorhanden */
  --c-brand-text: #850c54;
  --c-field-line: #8a8a8a;
}

@media (prefers-color-scheme: dark) {
  .menu {
    --c-bg: var(--color-surface-base, #212121);
    --c-text: var(--color-text-primary, #ffffff);

    --c-brand-text: #e58ac0;
  }
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}
.search {
  grid-column: 1 / -1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.field label {
  color: var(--c-text);
  font-size: 13px;
  font-weight: 500;
}
.field select {
  width: 100%;
  padding: 8px 10px;
  background: var(--c-bg);
  color: var(--c-text);
  border: 1px solid var(--c-field-line);
  border-radius: 6px;
  font: inherit;
  font-size: 14px;
}
.field select:focus-visible,
.reset-btn:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}

.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  min-height: 24px;
}
.count {
  margin: 0;
  color: var(--c-text);
  font-size: 13px;
}
.reset-btn {
  padding: 0;
  background: none;
  border: none;
  color: var(--c-brand-text);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
</style>