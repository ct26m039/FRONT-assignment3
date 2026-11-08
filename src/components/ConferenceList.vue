<!-- src/components/ConferenceList.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useConferenceData } from '../composables/useConferenceData'
import BaseMenu from './BaseMenu.vue'
import BaseList from './BaseList.vue'

const { sessions, filterSessions, groupSessionsByDay, filterOptions } = useConferenceData()

const emptyFilters = () => ({ query: '', trackId: '', day: '', level: '', format: '' })
const filters = ref(emptyFilters())
const resetFilters = () => {
  filters.value = emptyFilters()
}

const formatDay = (day) =>
  new Intl.DateTimeFormat('de-AT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${day}T00:00:00`))

// Optionen für BaseMenu als [{ value, label }]
const trackOptions = filterOptions.tracks.map((t) => ({ value: t.id, label: t.name }))
const dayOptions = filterOptions.days.map((d) => ({ value: d, label: formatDay(d) }))
const levelOptions = filterOptions.levels.map((l) => ({ value: l, label: l }))
const formatOptions = filterOptions.formats.map((f) => ({ value: f, label: f }))

// Filter (UND-verknüpft) -> nach Tag gruppieren -> Beschriftung ergänzen
const filtered = computed(() => filterSessions(filters.value))
const groups = computed(() =>
  groupSessionsByDay(filtered.value).map((g) => ({ ...g, label: formatDay(g.day) })),
)
</script>

<template>
  <div class="overview">
    <h2 class="page-title">Programm</h2>

    <BaseMenu
      v-model="filters"
      :tracks="trackOptions"
      :days="dayOptions"
      :levels="levelOptions"
      :formats="formatOptions"
      :result-count="filtered.length"
      :total-count="sessions.length"
      @reset="resetFilters"
    />

    <BaseList :groups="groups" @reset="resetFilters" />
  </div>
</template>

<style scoped>
.overview {
  --c-bg: var(--color-surface-base, #ffffff);
  --c-text: var(--color-text-primary, #2d2d2d);

  /* Kein Token vorhanden */
  --c-line: #dedede;
}

@media (prefers-color-scheme: dark) {
  .overview {
    --c-bg: var(--color-surface-base, #212121);
    --c-text: var(--color-text-primary, #ffffff);

    --c-line: #3d3d3d;
  }
}

.overview {
  width: min(800px, calc(100vw - 2rem));
  margin: var(--spacing-lg, 1.5rem) auto;
  padding: 20px 28px 12px;
  background: var(--c-bg);
  color: var(--c-text);
  border: 1px solid var(--c-line);
  border-radius: 12px;
  text-align: left;
}

.page-title {
  margin: 0 0 16px;
  color: var(--c-text);
  font-size: 22px;
  font-weight: 500;
}
</style>