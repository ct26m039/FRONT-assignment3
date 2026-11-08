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

// ID aus der Route auslesen (z.B. /sessions/s01)
const sessionId = computed(() => route.params.id)
const session = computed(() => getSessionById(sessionId.value))
const parallelSessions = computed(() => getParallelSessions(sessionId.value))
</script>

<template>
  <div v-if="session" class="session-detail">
    <button class="back-btn" @click="router.back()">← Zurück</button>

    <header class="detail-header">
      <div class="badges">
        <span class="badge track">{{ session.track?.name }}</span>
        <span class="badge level">{{ session.level }}</span>
        <span class="badge format">{{ session.format }}</span>
      </div>
      
      <h1>{{ session.title }}</h1>
      
      <div class="meta-bar">
        <span>📅 {{ session.day }}</span>
        <span>⏰ {{ session.startTime }} – {{ session.endTime }}</span>
        <span>📍 {{ session.room?.name }} (Kapazität: {{ session.room?.capacity }})</span>
      </div>

      <button 
        class="program-btn"
        :class="{ active: isSaved(session.id) }"
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

    <!-- Parallele Sessions (Zusatznutzen aus useConferenceData) -->
    <section v-if="parallelSessions.length" class="section">
      <h3>Parallele Sessions in diesem Zeitslot:</h3>
      <ul class="parallel-list">
        <li v-for="p in parallelSessions" :key="p.id">
          <RouterLink :to="`/sessions/${p.id}`">{{ p.title }}</RouterLink>
          <span class="muted">({{ p.room?.name }})</span>
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
  padding: 2rem 1rem;
  text-align: left;
}
.back-btn {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  padding: 0;
}
.badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}
.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-weight: bold;
}
.badge.track { background: var(--accent-bg); color: var(--accent); }
.badge.level { background: #30041e; color: #fff; }
.badge.format { background: var(--border); color: var(--text-h); }

.detail-header h1 {
  margin: 0.5rem 0 1rem;
}
.meta-bar {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  color: var(--text);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}
.program-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: 1px solid var(--accent);
  background: var(--bg);
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.program-btn.active {
  background: var(--accent);
  color: #fff;
}
.section {
  margin-top: 2rem;
}
.abstract {
  line-height: 1.6;
}
.speaker-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.speaker-card {
  padding: 0.75rem;
  background: var(--code-bg);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}
.speaker-name {
  color: var(--accent);
  font-weight: bold;
  text-decoration: none;
}
.speaker-title {
  font-size: 0.85rem;
  color: var(--text);
}
.parallel-list {
  padding-left: 1.25rem;
  margin-top: 0.5rem;
}
.parallel-list a {
  color: var(--accent);
}
.muted {
  color: var(--text);
  margin-left: 0.5rem;
}
</style>