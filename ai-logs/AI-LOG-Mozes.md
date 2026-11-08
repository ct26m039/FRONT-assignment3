# AI-LOG

Eintrag 1

Datum: 2026-11-08

Tool: Gemini

Prompt:

"ich habe folgende daten: conference-data, das ist unsere useConferneceData.js: import data from '../assets/data/conference-data.json'

// Vite already parses JSON imports into a JS object, so no JSON.parse here.
// The data is static, so lookup maps are built once at module load and shared
// by every component that calls the composable.
const byId = (list) => new Map(list.map((item) => [item.id, item]))

const sessionMap = byId(data.sessions)
const speakerMap = byId(data.speakers)
const trackMap = byId(data.tracks)
const roomMap = byId(data.rooms)

// "HH:MM" -> minutes since midnight, used for overlap checks.
export const toMinutes = (time) => {
const [h, m] = time.split(':').map(Number)
return h * 60 + m
}

// ISO dates ("2026-09-15") and zero-padded times ("09:00") sort correctly as strings.
export const bySchedule = (a, b) =>
a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime)

// True if two sessions take place on the same day and their time ranges intersect.
export const overlaps = (a, b) =>
a.day === b.day &&
toMinutes(a.startTime) < toMinutes(b.endTime) &&
toMinutes(b.startTime) < toMinutes(a.endTime)

const unique = (values) => [...new Set(values)]

// Replaces the ID references of a session with the referenced objects.
// The original fields (trackId, roomId, speakerIds) are kept for convenience.
function resolveSession(session) {
if (!session) return null
return {
...session,
track: trackMap.get(session.trackId) ?? null,
room: roomMap.get(session.roomId) ?? null,
speakers: session.speakerIds.map((id) => speakerMap.get(id)).filter(Boolean),
}
}

const allSessions = data.sessions.map(resolveSession).sort(bySchedule)
const resolvedSessionMap = byId(allSessions)

// ---------- Lookups ----------

const getSessionById = (id) => resolvedSessionMap.get(id) ?? null
const getSpeakerById = (id) => speakerMap.get(id) ?? null
const getTrackById = (id) => trackMap.get(id) ?? null
const getRoomById = (id) => roomMap.get(id) ?? null

// ---------- ConferenceList ----------

const getAllSessions = () => allSessions

/**

All criteria are optional; empty values are ignored.

query matches title, abstract and speaker names (case-insensitive).
*/
function filterSessions({ query = '', trackId, day, level, format } = {}, sessions = allSessions) {
const q = query.trim().toLowerCase()
return sessions.filter((s) =>
(!trackId || s.trackId === trackId) &&
(!day || s.day === day) &&
(!level || s.level === level) &&
(!format || s.format === format) &&
(!q ||
s.title.toLowerCase().includes(q) ||
s.abstract.toLowerCase().includes(q) ||
s.speakers.some((sp) => sp.name.toLowerCase().includes(q)))
)
}

// Returns [{ day, sessions }] in date order, so templates can v-for over it directly.
function groupSessionsByDay(sessions = allSessions) {
const groups = new Map()
for (const s of [...sessions].sort(bySchedule)) {
if (!groups.has(s.day)) groups.set(s.day, [])
groups.get(s.day).push(s)
}
return [...groups].map(([day, list]) => ({ day, sessions: list }))
}

// Returns [{ day, startTime, endTime, sessions }], i.e. the parallel sessions per slot.
function groupSessionsByTimeslot(sessions = allSessions) {
const groups = new Map()
for (const s of [...sessions].sort(bySchedule)) {
const key = ${s.day} ${s.startTime}
if (!groups.has(key)) {
groups.set(key, { day: s.day, startTime: s.startTime, endTime: s.endTime, sessions: [] })
}
groups.get(key).sessions.push(s)
}
return [...groups.values()]
}

// Options for filter dropdowns, derived from the data so they never go stale.
const filterOptions = {
tracks: data.tracks,
days: data.conference.dates,
levels: unique(data.sessions.map((s) => s.level)),
formats: unique(data.sessions.map((s) => s.format)),
}

// ---------- Conference (single session) ----------

// Sessions overlapping the given one (excluding itself). Accepts an ID or a session.
function getParallelSessions(sessionOrId) {
const session = typeof sessionOrId === 'string' ? getSessionById(sessionOrId) : sessionOrId
if (!session) return []
return allSessions.filter((s) => s.id !== session.id && overlaps(s, session))
}

// ---------- SpeakerProfile ----------

// Derived from session.speakerIds (single source of truth) instead of speaker.sessionIds.
const getSessionsBySpeaker = (speakerId) =>
allSessions.filter((s) => s.speakerIds.includes(speakerId))

// Everyone sharing at least one session with the speaker (e.g. the s20 panel).
function getCoSpeakers(speakerId) {
const ids = new Set(getSessionsBySpeaker(speakerId).flatMap((s) => s.speakerIds))
ids.delete(speakerId)
return [...ids].map((id) => speakerMap.get(id)).filter(Boolean)
}

// ---------- MyProgram (stateless helpers; the stored ID list lives elsewhere) ----------

// Turns a list of saved session IDs into sorted session objects; unknown IDs are dropped.
const getSessionsByIds = (ids) => ids.map(getSessionById).filter(Boolean).sort(bySchedule)

// All pairs of overlapping sessions within the given list.
function findConflicts(sessions) {
const pairs = []
for (let i = 0; i < sessions.length; i++) {
for (let j = i + 1; j < sessions.length; j++) {
if (overlaps(sessions[i], sessions[j])) pairs.push([sessions[i], sessions[j]])
}
}
return pairs
}

// ---------- Public API ----------

export function useConferenceData() {
return {
// raw data
conference: data.conference,
sessions: allSessions,
speakers: data.speakers,
tracks: data.tracks,
rooms: data.rooms,
filterOptions,

// lookups
getSessionById,
getSpeakerById,
getTrackById,
getRoomById,

// ConferenceList
getAllSessions,
filterSessions,
groupSessionsByDay,
groupSessionsByTimeslot,

// Conference
getParallelSessions,

// SpeakerProfile
getSessionsBySpeaker,
getCoSpeakers,

// MyProgram
getSessionsByIds,
findConflicts,


}
}

das sind unsere useLocalstoarage: import { ref, watch } from 'vue'

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

function read(key, defaultValue) {
if (!isBrowser) return defaultValue
try {
const raw = window.localStorage.getItem(key)
return raw === null ? defaultValue : JSON.parse(raw)
} catch {
// Corrupt or manually edited entry: fall back instead of crashing the app.
return defaultValue
}
}

/**

A ref that is initialised from localStorage and written back on every change.

Values are stored as JSON, so arrays and objects work too.
*/
export function useLocalStorage(key, defaultValue) {
const state = ref(read(key, defaultValue))

watch(
state,
(value) => {
if (!isBrowser) return
try {
window.localStorage.setItem(key, JSON.stringify(value))
} catch {
// Quota exceeded or storage disabled (e.g. private mode): keep in-memory state.
}
},
{ deep: true }
)

return state
}

unser style css: [Design Tokens & Globale Styles aus Schritt 1]
und im Anhang unsere Gerüst. [conference-data.json und Projekt-Ordnerstruktur]"

Zweck: Implementierung der Session-Detailseite (Conference.vue), des Dashboards (MyProgram.vue) und des reaktiven State-Managements (useMyProgram.js) basierend auf der vorhandenen Ordnerstruktur und den Composables.

Output:

// src/composables/useMyProgram.js
import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { useConferenceData } from './useConferenceData'

// Globaler reaktiver Zustand über localStorage: speichert Array von Session-IDs
const savedSessionIds = useLocalStorage('my-program-session-ids', [])

export function useMyProgram() {
  const { getSessionsByIds, findConflicts } = useConferenceData()

  // Liefert die vollen Session-Objekte aufgelöst und nach Zeit sortiert
  const savedSessions = computed(() => getSessionsByIds(savedSessionIds.value))

  // Findet Zeitkonflikte unter den gemerkten Sessions
  const conflicts = computed(() => findConflicts(savedSessions.value))

  function isSaved(sessionId) {
    return savedSessionIds.value.includes(sessionId)
  }

  function toggleSession(sessionId) {
    if (isSaved(sessionId)) {
      savedSessionIds.value = savedSessionIds.value.filter((id) => id !== sessionId)
    } else {
      savedSessionIds.value = [...savedSessionIds.value, sessionId]
    }
  }

  function removeSession(sessionId) {
    savedSessionIds.value = savedSessionIds.value.filter((id) => id !== sessionId)
  }

  return {
    savedSessionIds,
    savedSessions,
    conflicts,
    isSaved,
    toggleSession,
    removeSession,
  }
}


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


Eintrag 2

Datum: 2026-11-08

Tool: Gemini

Prompt:

"was beduetet das?"

Zweck: Verständnisklärung zu dynamischem Routing in Vue Router und warum Routen für /sessions/:id und /my-program nötig sind.

Output:
Das bedeutet, wie deine Web-App weiß, welche Vue-Komponente angezeigt werden soll, wenn man im Browser eine URL aufruft (z. B. beim Klick auf einen Vortrag).
Eine Vue-Anwendung ist standardmäßig eine Single-Page-App (SPA). Der Vue Router sorgt dafür, dass sich beim Klick auf einen Link die Seite ändert, ohne dass der Browser neu laden muss:

Klickt jemand auf /sessions/s01, soll deine Conference.vue mit den Daten von Session s01 angezeigt werden.

Klickt jemand auf /my-program, soll dein Dashboard MyProgram.vue angezeigt werden.
Dafür werden Routen definiert und in App.vue mit <RouterView /> ein Platzhalter eingerichtet.

Eintrag 3

Datum: 2026-11-08

Tool: Gemini

Prompt:

"import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')"

Zweck: Analyse der aktuellen main.ts und Einbindung des Vue Routers.

Output:
In eurer main.ts ist der Vue Router aktuell noch gar nicht eingebunden. Das Projekt rendert bisher nur starr App.vue.
Schritte zur Behebung:

npm install vue-router ausführen.

Router einrichten und registrieren:

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

import ConferenceList from './components/ConferenceList.vue'
import Conference from './components/Conference.vue'
import SpeakerProfile from './components/SpeakerProfile.vue'
import MyProgram from './components/MyProgram.vue'

const routes = [
  { path: '/', component: ConferenceList },
  { path: '/sessions/:id', component: Conference },
  { path: '/speakers/:id', component: SpeakerProfile },
  { path: '/my-program', component: MyProgram },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')


Eintrag 4

Datum: 2026-11-08

Tool: Gemini

Prompt:

"warum brauche ich das genau"

Zweck: Klärung des Unterschieds zwischen statischer Komponenteneinbindung und Routing.

Output:
Du brauchst den Router aus zwei Gründen:

Vorgabe der Aufgabenstellung: In der Angabe steht explizit, dass jede Session eine eigene Route (z. B. /sessions/[id]) und „Mein Programm“ eine eigene Seite haben muss.

Technischer Grund in Single-Page-Apps (Vue): Ohne Router weiß der Browser nicht, was er tun soll, wenn du oben in der Adresszeile /sessions/s01 eingibst oder ein Nutzer auf einen Vortrag klickt. Der Router sorgt dafür, dass die URL wechselt und genau deine Conference.vue mit den Daten dieses Vortrags angezeigt wird, ohne dass die gesamte Website neu laden muss.

Eintrag 5

Datum: 2026-11-08

Tool: Gemini

Prompt:

"was use myprogram macht macht das nicht useConfernece data"

Zweck: Architektur-Klärung der Verantwortlichkeiten zwischen useConferenceData.js und useMyProgram.js.

Output:
Der Unterschied liegt in der Trennung von statischen Konferenzdaten und dynamischen Benutzerdaten:

useConferenceData.js (Eure Konferenz-Datenbank):

Enthält nur die festen Konferenzinhalte aus der conference-data.json.

Stellt zustandslose Hilfsfunktionen bereit (getSessionById, findConflicts, getSessionsByIds).

Speichert keine Benutzerdaten (// MyProgram (stateless helpers; the stored ID list lives elsewhere)).

useMyProgram.js (Der persönliche Zustand des Nutzers):

Verwaltet Hinzufügen, Entfernen und Merken.

Verbindet useLocalStorage mit useConferenceData.

Hält die reaktive Liste gespeicherter IDs persistent im Browser.

Eintrag 6

Datum: 2026-11-08

Tool: Gemini

Prompt:

"das ist unser App.vue: 
import ConferenceList from "./components/ConferenceList.vue";


Zweck: Refaktorisierung von App.vue zur dynamischen Einbindung von <RouterView /> und globaler Navigationsleiste.

Output:

<!-- src/App.vue -->
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>VibeConnect - Conference App</h1>
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link">Übersicht</RouterLink>
        <RouterLink to="/my-program" class="nav-link">Mein Programm</RouterLink>
      </nav>
    </header>

    <main class="content-container">
      <!-- Hier schaltet der Router automatisch zwischen Übersicht, Session-Detail und Mein Programm um -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #dedede;
    min-height: 100vh;
    width: 100%;
  }

  .app-header {
    width: 100%;
    max-width: 900px;
    padding: 1.5rem 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  h1 {
    font-size: 2em;
    color: #850c54;
    text-align: center;
    margin: 0;
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  .nav-link {
    text-decoration: none;
    color: #2d2d2d;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    background: #ffffff;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    color: #850c54;
  }

  /* Aktiver Link wird hervorgehoben */
  .router-link-active {
    background-color: #850c54;
    color: #ffffff !important;
  }

  .content-container {
    width: 100%;
    max-width: 900px;
    padding: 1rem;
    box-sizing: border-box;
  }
</style>


Eintrag 7

Datum: 2026-11-08

Tool: Gemini

Prompt:

"muss ich auch noch die main anpassen? ich habe die änderungen von meinem Partner noch nciht ich möchte ncith dass ich hier etwas ändere was nicht geändert werden solll"

Zweck: Konfliktfreie Einbindung des Routers in main.ts, ohne den parallelen Entwicklungszweig von Person 1 zu beeinträchtigen.

Output:
Um Konflikte zu vermeiden, wird das Routing in eine eigene Datei src/router.ts ausgelagert und mit Dynamic Imports (Lazy Loading) versehen:

// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    component: () => import('./components/ConferenceList.vue') 
  },
  { 
    path: '/sessions/:id', 
    component: () => import('./components/Conference.vue') 
  },
  { 
    path: '/speakers/:id', 
    component: () => import('./components/SpeakerProfile.vue') 
  },
  { 
    path: '/my-program', 
    component: () => import('./components/MyProgram.vue') 
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})


In src/main.ts werden lediglich zwei Zeilen ergänzt:

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router' // Zeile 1

const app = createApp(App)
app.use(router)                  // Zeile 2
app.mount('#app')


Eintrag 8

Datum: 2026-11-08

Tool: Gemini

Prompt:

"und die App.vue passe ich auch an?"

Zweck: Bestätigung und Erklärung, warum App.vue angepasst werden muss, um Routen dynamisch über <RouterView /> anzuzeigen.

Output:
Ja, App.vue muss angepasst werden. Bisher steht dort noch starr <ConferenceList/> im Template. Wenn diese Zeile so bleibt, zeigt der Browser immer stur nur die Übersicht an – egal welche URL (wie /sessions/s01 oder /my-program) aufgerufen wird.

Minimale und saubere Umstellung:

<!-- src/App.vue -->
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <h1>VibeConnect - Conference App</h1>
      <nav style="display: flex; gap: 1rem; margin-bottom: 1rem;">
        <RouterLink to="/">Übersicht</RouterLink>
        <RouterLink to="/my-program">Mein Programm</RouterLink>
      </nav>
    </header>

    <main>
      <!-- Hier rendert der Router dynamisch die aufgerufene Seite hinein -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
  h1 {
    font-size: 2em;
    color: #850c54;
    text-align: center;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #dedede;
    min-height: 100vh;
  }
</style>
