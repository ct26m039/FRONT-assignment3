<script setup>
import { RouterLink } from 'vue-router'
import { useConferenceData } from '../composables/useConferenceData'

const { groupSessionsByDay } = useConferenceData()

// [{ day, sessions }] in Datumsreihenfolge, Sessions nach Uhrzeit sortiert
const days = groupSessionsByDay()

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
  </div>
</template>

<style scoped>
.overview {
  --c-bg: var(--color-surface-base, #ffffff);
  --c-card: var(--color-surface-card, #cccccc);
  --c-text: var(--color-text-primary, #2d2d2d);

  /* Kein Token vorhanden */
  --c-brand-text: #850c54;
  --c-tint: #f3dfea;
  --c-line: #dedede;
}

@media (prefers-color-scheme: dark) {
  .overview {
    --c-bg: var(--color-surface-base, #212121);
    --c-card: var(--color-surface-card, #2d2d2d);
    --c-text: var(--color-text-primary, #ffffff);

    --c-brand-text: #e58ac0;
    --c-tint: #3a1428;
    --c-line: #3d3d3d;
  }
}

.overview {
  width: min(800px, calc(100vw - 2rem));
  margin: var(--spacing-lg, 1.5rem) auto;
  padding: 8px 28px 12px;
  background: var(--c-bg);
  color: var(--c-text);
  border: 1px solid var(--c-line);
  border-radius: 12px;
  text-align: left;
}

.day {
  margin-top: 20px;
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
  gap: 12px;
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

.room {
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

@media (max-width: 560px) {
  .session-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>