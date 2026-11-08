<!-- src/components/Conference.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useConferenceData } from '../composables/useConferenceData'
import { useMyProgram } from '../composables/useMyProgram'

const route = useRoute()
const router = useRouter()
const { getSessionById, getParallelSessions } = useConferenceData()
const { isSaved, toggleSession } = useMyProgram()

const sessionId = computed(() => route.params.id)
const session = computed(() => getSessionById(sessionId.value))
const parallelSessions = computed(() => getParallelSessions(sessionId.value))
</script>

<template>
  <div v-if="session" class="session-detail">
    <button class="back-btn" @click="router.back()">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14" />
        <path d="M5 12l6 6" />
        <path d="M5 12l6 -6" />
      </svg>
      Zurück
    </button>

    <header class="detail-header">
      <div class="badges">
        <span class="badge track">{{ session.track?.name }}</span>
        <span class="badge level">{{ session.level }}</span>
        <span class="badge format">{{ session.format }}</span>
      </div>

      <h1>{{ session.title }}</h1>

      <div class="meta-bar">
        <span>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M4 11h16" />
          </svg>
          {{ session.day }}
        </span>
        <span>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          {{ session.startTime }} – {{ session.endTime }}
        </span>
        <span>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="11" r="3" />
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
          </svg>
          {{ session.room?.name }} (Kapazität: {{ session.room?.capacity }})
        </span>
      </div>

      <button
        class="program-btn"
        :class="{ active: isSaved(session.id) }"
        :aria-pressed="isSaved(session.id)"
        @click="toggleSession(session.id)"
      >
        {{ isSaved(session.id) ? '✓ Aus Mein Programm entfernen' : '+ Zu Mein Programm hinzufügen' }}
      </button>
    </header>

    <section class="section">
      <h2>Beschreibung</h2>
      <p class="abstract">{{ session.abstract }}</p>
    </section>

    <section class="section">
      <h2>Speaker</h2>
      <div class="speaker-list">
        <div v-for="speaker in session.speakers" :key="speaker.id" class="speaker-card">
          <RouterLink :to="`/speakers/${speaker.id}`" class="speaker-name">
            {{ speaker.name }}
          </RouterLink>
          <span class="speaker-title">{{ speaker.title }} @ {{ speaker.company }}</span>
        </div>
      </div>
    </section>

    <section v-if="parallelSessions.length" class="section">
      <h3>Parallele Sessions in diesem Zeitslot:</h3>
      <ul class="parallel-list">
        <li v-for="p in parallelSessions" :key="p.id">
          <RouterLink :to="`/sessions/${p.id}`">{{ p.title }}</RouterLink>
          <span class="room">({{ p.room?.name }})</span>
        </li>
      </ul>
    </section>
  </div>

  <div v-else class="not-found">
    <h2>Session nicht gefunden</h2>
    <p>Die angeforderte Session existiert nicht.</p>
    <RouterLink to="/">Zurück zur Übersicht</RouterLink>
  </div>
</template>

<style scoped>
.session-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: left;
}

.icon {
  flex-shrink: 0;
  width: 1.1em;
  height: 1.1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  padding: 0;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
  font: inherit;
  cursor: pointer;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.badge {
  padding: var(--spacing-xs) 0.6rem;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
.badge.track {
  background: var(--color-brand-tint);
  color: var(--color-brand-text);
}
.badge.level {
  background: var(--color-brand-secondary);
  border-color: var(--color-border-default);
  color: var(--color-text-on-brand);
}
.badge.format {
  background: var(--color-surface-card);
  color: var(--color-text-primary);
}

.detail-header h1 {
  margin-bottom: var(--spacing-md);
}

.meta-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
}
.meta-bar span {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.program-btn {
  padding: 0.6rem var(--spacing-md);
  border: 1px solid var(--color-brand-text);
  border-radius: var(--radius-md);
  background: var(--color-surface-base);
  color: var(--color-brand-text);
  font: inherit;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.program-btn.active {
  background: var(--color-brand-primary);
  border-color: var(--color-brand-primary);
  color: var(--color-text-on-brand);
}

.section {
  margin-top: var(--spacing-xl);
}
.section h2,
.section h3 {
  margin-bottom: var(--spacing-sm);
}

.abstract {
  line-height: 1.6;
}

.speaker-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.speaker-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  background: var(--color-surface-card);
  border-radius: var(--radius-md);
}
.speaker-name {
  color: var(--color-brand-text);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
}
.speaker-title {
  font-size: var(--font-size-sm);
}

.parallel-list {
  margin: var(--spacing-sm) 0 0;
  padding-left: var(--spacing-lg);
}
.parallel-list a {
  color: var(--color-brand-text);
}
.room {
  margin-left: var(--spacing-sm);
}

.not-found {
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
}
</style>