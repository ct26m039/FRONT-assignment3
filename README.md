# FRONT Team Assignment 2

Team Members: Mario Steindl & Fanny Mozes

AI Disclosure: Refer to logs in the ai-logs directory.

The app can be reached at https://ct26m039.github.io/FRONT-assignment3/. No further setup is required.

## Rendering Decision: Overview Page

**Reference to Task A:** Users repeatedly switch days, tracks, and levels. Since the entire data set is compact (20 sessions), the data is held on the client via `useConferenceData()`. The filter logic runs instantly and reactively directly in the browser. SSR is ruled out because of the latency when filtering. CSR provides the smoothest experience for attendees.

### Implementation

The overview page (`ConferenceList.vue`) is rendered entirely in the browser (client-side rendering in a Vue 3 SPA with Vite and Vue Router).

- **Data:** The 20 sessions are stored statically in `conference-data.json` and are bundled at build time via import. There are no network requests at runtime.
- **Preparation:** `useConferenceData()` builds the lookup maps (session, speaker, track, room) once when the module loads and resolves ID references into objects.
- **Filtering:** Track, conference day, and level (plus text search and format) are applied through `filterSessions()`. Multiple active filters are combined with AND. The result list is a `computed` value, so the display updates without a reload and without a server.
- **Grouping:** `groupSessionsByDay()` groups the result by day and sorts it by start time.


Addendum:

The original Fanny-Mozes branch caused issues during development and so was depricated mid-development. 
A new branch was created to fix issues, but the old branch is still available with all commits for proof of work.
