<<<<<<< HEAD
<!-- src/components/MyProgram.vue -->
<script setup>
import { RouterLink } from 'vue-router'
import { useMyProgram } from '../composables/useMyProgram'

const { savedSessions, conflicts, removeSession } = useMyProgram()
</script>

<template>
  <div class="my-program">
    <h1>Mein Programm</h1>
    <p class="intro">Deine persönlich zusammengestellte Konferenz-Agenda.</p>

    <!-- Warnung bei Zeitkonflikten -->
    <div v-if="conflicts.length" class="conflict-alert">
      <strong>⚠️ Zeitkonflikt festgestellt:</strong>
      <ul>
        <li v-for="([s1, s2], idx) in conflicts" :key="idx">
          "{{ s1.title }}" überschneidet sich mit "{{ s2.title }}" ({{ s1.day }}, {{ s1.startTime }}–{{ s1.endTime }})
        </li>
      </ul>
    </div>

    <!-- Leerer Zustand -->
    <div v-if="savedSessions.length === 0" class="empty-state">
      <p>Du hast noch keine Sessions zu deinem Programm hinzugefügt.</p>
      <RouterLink to="/" class="browse-link">Zur Programmübersicht</RouterLink>
    </div>

    <!-- Liste der gemerkten Sessions -->
    <div v-else class="session-list">
      <div 
        v-for="session in savedSessions" 
        :key="session.id" 
        class="session-item"
      >
        <div class="session-time">
          <span class="day">{{ session.day }}</span>
          <span class="hours">{{ session.startTime }} – {{ session.endTime }}</span>
        </div>

        <div class="session-info">
          <RouterLink :to="`/sessions/${session.id}`" class="title">
            {{ session.title }}
          </RouterLink>
          <div class="meta">
            <span>📍 {{ session.room?.name }}</span>
            <span>🏷️ {{ session.track?.name }}</span>
          </div>
          <div class="speakers">
            Speaker: 
            <span v-for="(sp, idx) in session.speakers" :key="sp.id">
              <RouterLink :to="`/speakers/${sp.id}`">{{ sp.name }}</RouterLink>
              <span v-if="idx < session.speakers.length - 1">, </span>
            </span>
          </div>
        </div>

        <div class="session-actions">
          <button class="remove-btn" @click="removeSession(session.id)">
            Entfernen
          </button>
        </div>
      </div>
    </div>
  </div>
=======
<script setup lang="ts">
import { useMyProgram} from "../composables/useMyProgram";
import { RouterLink } from "vue-router";

const { sessions, count, remove, conflicts } = useMyProgram();
</script>

<template>
    <RouterLink to="/">&larr; All sessions</RouterLink>
    <h1>My Program</h1>

    <div class="main-container">
        <p v-if="count === 0">Your program is empty.</p>
        <div v-for="session in sessions" :key="session.id" class="session">
            <RouterLink :to="`/sessions/${session.id}`">{{ session.title }}</RouterLink>
            <p>{{ session.abstract }}</p>
            <button @click="remove(session.id)">Remove</button>
        </div>
    </div>
    <div v-if="conflicts.length > 0" class="warning">
        <p>⚠️ Time conflicts in your program:</p>
        <ul>
            <li v-for="[a, b] in conflicts" :key="a.id + b.id">
                {{ a.title }} ↔ {{ b.title }} ({{ a.startTime }})
            </li>
        </ul>
    </div>
>>>>>>> bf312a7b85ef65c118046febc89e267b4a7d401c
</template>

<style scoped>
.my-program {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: left;
}
.intro {
  margin-bottom: 2rem;
  color: var(--text);
}
.conflict-alert {
  background: rgba(218, 20, 138, 0.1);
  border-left: 4px solid var(--accent);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  color: var(--text-h);
}
.conflict-alert ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
}
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: var(--code-bg);
  border-radius: 8px;
}
.browse-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--accent);
  font-weight: bold;
}
.session-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.session-item {
  display: flex;
  gap: 1.5rem;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 8px;
  align-items: center;
}
.session-time {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
  min-width: 110px;
  color: var(--text);
}
.session-time .hours {
  font-weight: bold;
  color: var(--text-h);
}
.session-info {
  flex-grow: 1;
}
.session-info .title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-h);
  text-decoration: none;
}
.session-info .title:hover {
  color: var(--accent);
}
.session-info .meta {
  font-size: 0.85rem;
  color: var(--text);
  margin-top: 0.25rem;
  display: flex;
  gap: 1rem;
}
.session-info .speakers {
  font-size: 0.85rem;
  color: var(--text);
  margin-top: 0.25rem;
}
.session-info .speakers a {
  color: var(--accent);
  text-decoration: none;
}
.remove-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.remove-btn:hover {
  border-color: #da148a;
  color: #da148a;
}
@media (max-width: 600px) {
  .session-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>