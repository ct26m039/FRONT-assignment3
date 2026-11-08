<!-- src/components/SearchBar.vue -->
<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Suche' },
  placeholder: { type: String, default: 'Titel, Beschreibung oder Speaker' },
  id: { type: String, default: 'search-bar' },
})

const emit = defineEmits(['update:modelValue'])

const onInput = (event) => emit('update:modelValue', event.target.value)
const clear = () => emit('update:modelValue', '')
</script>

<template>
  <div class="search-bar">
    <label :for="props.id">{{ props.label }}</label>

    <div class="input-wrap">
      <svg class="icon search-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="M21 21l-6 -6" />
      </svg>

      <input
        :id="props.id"
        :value="props.modelValue"
        type="search"
        :placeholder="props.placeholder"
        autocomplete="off"
        @input="onInput"
      />

      <button
        v-if="props.modelValue"
        class="clear-btn"
        type="button"
        aria-label="Suche leeren"
        @click="clear"
      >
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  --c-bg: var(--color-surface-base, #ffffff);
  --c-text: var(--color-text-primary, #2d2d2d);
  --c-accent: var(--color-brand-accent, #da148a);

  /* Kein Token vorhanden */
  --c-field-line: #8a8a8a;

  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

@media (prefers-color-scheme: dark) {
  .search-bar {
    --c-bg: var(--color-surface-base, #212121);
    --c-text: var(--color-text-primary, #ffffff);
  }
}

label {
  color: var(--c-text);
  font-size: 13px;
  font-weight: 500;
}

.input-wrap {
  position: relative;
}

input {
  width: 100%;
  padding: 8px 36px 8px 34px;
  background: var(--c-bg);
  color: var(--c-text);
  border: 1px solid var(--c-field-line);
  border-radius: 6px;
  font: inherit;
  font-size: 14px;
}
input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}
input:focus-visible,
.clear-btn:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}

.icon {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--c-text);
  pointer-events: none;
}

.clear-btn {
  position: absolute;
  top: 50%;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  transform: translateY(-50%);
  background: none;
  border: none;
  border-radius: 4px;
  color: var(--c-text);
  cursor: pointer;
}
</style>