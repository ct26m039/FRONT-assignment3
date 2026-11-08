<script setup>
import { computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useConferenceData } from '../composables/useConferenceData'

const { sessions, filterSessions, groupSessionsByDay, filterOptions } = useConferenceData()

const emptyFilters = () => ({ query: '', trackId: '', day: '', level: '', format: '' })
const filters = reactive(emptyFilters())

// Gefilterte Sessions, danach nach Tag gruppiert: [{ day, sessions }]
const filtered = computed(() => filterSessions(filters))
const days = computed(() => groupSessionsByDay(filtered.value))

const hasFilters = computed(() => Object.values(filters).some((v) => v !== ''))
const resetFilters = () => Object.assign(filters, emptyFilters())

const formatDay = (day) =>
  new Intl.DateTimeFormat('de-AT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${day}T00:00:00`))

const speakerNames = (session) => session.speakers.map((s) => s.name).join(', ')
</script>

<template>
  <div class="overview">
     <h2 class="page-title">Programm</h2>
    <div class="filters" role="search">
      <div class="field search">
        <label for="f-query">Suche</label>
        <input
          id="f-query"
          v-model="filters.query"
          type="search"
          placeholder="Titel, Beschreibung oder Speaker"
        />
      </div>

      <div class="field">
        <label for="f-track">Track</label>
        <select id="f-track" v-model="filters.trackId">
          <option value="">Alle Tracks</option>
          <option v-for="track in filterOptions.tracks" :key="track.id" :value="track.id">
            {{ track.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="f-day">Tag</label>
        <select id="f-day" v-model="filters.day">
          <option value="">Alle Tage</option>
          <option v-for="day in filterOptions.days" :key="day" :value="day">
            {{ formatDay(day) }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="f-level">Level</label>
        <select id="f-level" v-model="filters.level">
          <option value="">Alle Level</option>
          <option v-for="level in filterOptions.levels" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="f-format">Format</label>
        <select id="f-format" v-model="filters.format">
          <option value="">Alle Formate</option>
          <option v-for="format in filterOptions.formats" :key="format" :value="format">
            {{ format }}
          </option>
        </select>
      </div>
    </div>

    <div class="result-bar">
      <p class="count" aria-live="polite">{{ filtered.length }} von {{ sessions.length }} Sessions</p>
      <button v-if="hasFilters" class="reset-btn" type="button" @click="resetFilters">
        Filter zurücksetzen
      </button>
    </div>

    <section v-for="group in days" :key="group.day" class="day">
      <h2>{{ formatDay(group.day) }}</h2>

      <ul class="session-list">
        <li v-for="session in group.sessions" :key="session.id" class="session-row">
          <span class="time">{{ session.startTime }} – {{ session.endTime }}</span>

          <div class="info">
            <RouterLink :to="`/sessions/${session.id}`" class="title">
              {{ session.title }}
            </RouterLink>

            <span class="speakers">{{ speakerNames(session) }}</span>

            <div class="row-meta">
              <span class="badge track">{{ session.track?.name }}</span>
              <span class="badge format">{{ session.level }}</span>
              <span class="badge format">{{ session.format }}</span>
              <span class="room">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="11" r="3" />
                  <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                </svg>
                {{ session.room?.name }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <div v-if="!filtered.length" class="empty">
      <h2>Keine Sessions gefunden</h2>
      <p>Passe die Suche an oder setze die Filter zurück.</p>
      <button class="reset-btn" type="button" @click="resetFilters">Filter zurücksetzen</button>
    </div>
  </div>
</template>

<style scoped>
.overview {
  --c-bg: var(--color-surface-base, #ffffff);
  --c-card: var(--color-surface-card, #cccccc);
  --c-text: var(--color-text-primary, #2d2d2d);
  --c-accent: var(--color-brand-accent, #da148a);

  /* Kein Token vorhanden */
  --c-brand-text: #850c54;
  --c-tint: #f3dfea;
  --c-pill: #dedede;
  --c-line: #dedede;
  --c-field-line: #8a8a8a;
}

@media (prefers-color-scheme: dark) {
  .overview {
    --c-bg: var(--color-surface-base, #212121);
    --c-card: var(--color-surface-card, #2d2d2d);
    --c-text: var(--color-text-primary, #ffffff);

    --c-brand-text: #e58ac0;
    --c-tint: #3a1428;
    --c-pill: #3d3d3d;
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

/* ---------- Filter ---------- */
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.field.search {
  grid-column: 1 / -1;
}
.field label {
  font-size: 13px;
  font-weight: 500;
}

.field input,
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
.field input:focus-visible,
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

/* ---------- Liste ---------- */
.day {
  margin-top: 12px;
}
.day h2 {
  margin: 0 0 8px;
  color: var(--c-text);
  font-size: 18px;
  font-weight: 500;
}

.session-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.session-row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid var(--c-line);
}

.time {
  padding-top: 2px;
  font-size: 14px;
  font-weight: 500;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  color: var(--c-brand-text);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
}
.title:hover {
  text-decoration: underline;
}

.speakers {
  font-size: 14px;
}

.row-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.badge {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}
.badge.track {
  background: var(--c-tint);
  color: var(--c-brand-text);
}
.badge.format {
  background: var(--c-pill);
  color: var(--c-text);
}

.room {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
  font-size: 13px;
}

.icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------- Leerer Zustand ---------- */
.empty {
  padding: 32px 0 24px;
  text-align: center;
}
.empty h2 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 500;
}
.empty p {
  margin: 0 0 12px;
  font-size: 14px;
}

@media (max-width: 560px) {
  .session-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>