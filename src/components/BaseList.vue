<!-- src/components/BaseList.vue -->
<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  // [{ day, label, sessions }] – bereits gefiltert und nach Tag gruppiert
  groups: { type: Array, default: () => [] },
})

const emit = defineEmits(['reset'])

const speakerNames = (session) => session.speakers.map((s) => s.name).join(', ')
</script>

<template>
  <div class="list">
    <section v-for="group in props.groups" :key="group.day" class="day">
      <h3>{{ group.label }}</h3>

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

    <div v-if="!props.groups.length" class="empty">
      <h3>Keine Sessions gefunden</h3>
      <p>Passe die Suche an oder setze die Filter zurück.</p>
      <button class="reset-btn" type="button" @click="emit('reset')">Filter zurücksetzen</button>
    </div>
  </div>
</template>

<style scoped>
.list {
  --c-bg: var(--color-surface-base, #ffffff);
  --c-text: var(--color-text-primary, #2d2d2d);
  --c-accent: var(--color-brand-accent, #da148a);

  /* Kein Token vorhanden */
  --c-brand-text: #850c54;
  --c-tint: #f3dfea;
  --c-pill: #dedede;
  --c-line: #dedede;
}

@media (prefers-color-scheme: dark) {
  .list {
    --c-bg: var(--color-surface-base, #212121);
    --c-text: var(--color-text-primary, #ffffff);

    --c-brand-text: #e58ac0;
    --c-tint: #3a1428;
    --c-pill: #3d3d3d;
    --c-line: #3d3d3d;
  }
}

.day {
  margin-top: 12px;
}
.day h3 {
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
  color: var(--c-text);
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
.title:focus-visible,
.reset-btn:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
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

.empty {
  padding: 32px 0 24px;
  color: var(--c-text);
  text-align: center;
}
.empty h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 500;
}
.empty p {
  margin: 0 0 12px;
  font-size: 14px;
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

@media (max-width: 560px) {
  .session-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>