<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useConferenceData } from '../composables/useConferenceData'

// Filled from the route param /sessions/:id (router uses `props: true`).
const props = defineProps<{ id: string }>()

const { getSessionById } = useConferenceData()

// computed, so the page updates when navigating from one session to another
// (Vue Router reuses the component instance and only changes the prop).
const session = computed(() => getSessionById(props.id))

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
    <div class="conference-container">
        <RouterLink to="/" class="back-link">&larr; All sessions</RouterLink>

        <article v-if="session" class="session">
            <header>
                <p class="track">{{ session.track?.name }}</p>
                <h1>{{ session.title }}</h1>
            </header>

            <dl class="meta">
                <div>
                    <dt>Time</dt>
                    <dd>
                        {{ formatDay(session.day) }}<br />
                        <time :datetime="`${session.day}T${session.startTime}`">{{ session.startTime }}</time>
                        &ndash;
                        <time :datetime="`${session.day}T${session.endTime}`">{{ session.endTime }}</time>
                    </dd>
                </div>
                <div>
                    <dt>Room</dt>
                    <dd>{{ session.room?.name ?? 'TBA' }}</dd>
                </div>
                <div>
                    <dt>Track</dt>
                    <dd>{{ session.track?.name ?? '–' }}</dd>
                </div>
                <div>
                    <dt>Level</dt>
                    <dd>{{ session.level }}</dd>
                </div>
                <div>
                    <dt>Format</dt>
                    <dd>{{ session.format }}</dd>
                </div>
            </dl>

            <section>
                <h2>Abstract</h2>
                <p>{{ session.abstract }}</p>
            </section>

            <section>
                <h2>{{ session.speakers.length === 1 ? 'Speaker' : 'Speakers' }}</h2>
                <ul class="speakers">
                    <li v-for="speaker in session.speakers" :key="speaker.id">
                        <strong>{{ speaker.name }}</strong>
                        <span>{{ speaker.title }}, {{ speaker.company }}</span>
                        <p>{{ speaker.bio }}</p>
                    </li>
                </ul>
            </section>
        </article>

        <div v-else class="not-found">
            <h1>Session not found</h1>
            <p>There is no session with the ID “{{ id }}”.</p>
        </div>
    </div>
</template>

<style scoped>

</style>
