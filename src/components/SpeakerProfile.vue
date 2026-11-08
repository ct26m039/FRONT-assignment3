<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useConferenceData } from '../composables/useConferenceData'

// Filled from the route param /speakers/:id (router uses `props: true`).
const props = defineProps<{ id: string }>()

const { getSpeakerById, getSessionsBySpeaker } = useConferenceData()

// computed, so the page updates when navigating from one speaker to another
// (Vue Router reuses the component instance and only changes the prop).
const speaker = computed(() => getSpeakerById(props.id))

// Derived from session.speakerIds, already sorted by day and start time.
const sessions = computed(() => (speaker.value ? getSessionsBySpeaker(props.id) : []))

const dateFormat = new Intl.DateTimeFormat('de-AT', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
// "2026-09-15" -> local date (avoids the UTC shift of new Date("2026-09-15")).
const formatDay = (day: string) => {
  const [y, m, d] = day.split('-').map(Number)
  return dateFormat.format(new Date(y, m - 1, d))
}
</script>

<template>
  <div class="speaker-container">
    <RouterLink to="/" class="back-link">&larr; All sessions</RouterLink>

    <article v-if="speaker" class="speaker">
      <header>
        <h1>{{ speaker.name }}</h1>
        <p class="role">{{ speaker.title }}, {{ speaker.company }}</p>
      </header>

      <section>
        <h2>About</h2>
        <p class="bio">{{ speaker.bio }}</p>
      </section>

      <section>
        <h2>{{ sessions.length === 1 ? 'Session' : 'Sessions' }}</h2>
        <ul class="sessions">
          <li v-for="session in sessions" :key="session.id">
            <RouterLink :to="{ name: 'session', params: { id: session.id } }" class="session-title">
              {{ session.title }}
            </RouterLink>
            <span class="session-meta">
              {{ formatDay(session.day) }},
              <time :datetime="`${session.day}T${session.startTime}`">{{ session.startTime }}</time>
              &ndash;
              <time :datetime="`${session.day}T${session.endTime}`">{{ session.endTime }}</time>
              &middot; {{ session.room?.name ?? 'TBA' }} &middot; {{ session.format }}
            </span>
          </li>
        </ul>
      </section>
    </article>

    <div v-else class="not-found">
      <h1>Speaker not found</h1>
      <p>There is no speaker with the ID “{{ id }}”.</p>
    </div>
  </div>
</template>

<style scoped>
.speaker-container {
  --c-bg: var(--color-surface-base, #ffffff);
  --c-card: var(--color-surface-card, #cccccc);
  --c-text: var(--color-text-primary, #2d2d2d);
  --c-accent: var(--color-brand-accent, #da148a);

  /* No token available */
  --c-brand-text: #850c54;
  --c-line: #dedede;

  width: min(800px, calc(100vw - 2rem));
  margin: var(--spacing-lg, 1.5rem) auto;
  padding: 24px 28px 28px;
  background: var(--c-bg);
  color: var(--c-text);
  border: 1px solid var(--c-line);
  border-radius: 12px;
  text-align: left;
}

@media (prefers-color-scheme: dark) {
  .speaker-container {
    --c-bg: var(--color-surface-base, #212121);
    --c-card: var(--color-surface-card, #2d2d2d);
    --c-text: var(--color-text-primary, #ffffff);

    --c-brand-text: #e58ac0;
    --c-line: #3d3d3d;
  }
}

.back-link {
  display: inline-block;
  margin-bottom: 18px;
  color: var(--c-text);
  font-size: 15px;
  text-decoration: none;
}

h1,
h2 {
  margin: 0;
  color: var(--c-text);
  font-weight: 500;
}
h1 {
  font-size: 26px;
}
h2 {
  margin-bottom: 8px;
  font-size: 18px;
}

.role {
  margin: 6px 0 0;
  font-size: 15px;
}

section {
  margin-top: 28px;
}

.bio {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}

.sessions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.sessions li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  background: var(--c-card);
  border-radius: 6px;
}
.session-title {
  color: var(--c-brand-text);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
}
.session-title:hover {
  text-decoration: underline;
}
.session-meta {
  font-size: 13px;
}

.back-link:focus-visible,
.session-title:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}

.not-found {
  padding: 16px 0;
}
</style>