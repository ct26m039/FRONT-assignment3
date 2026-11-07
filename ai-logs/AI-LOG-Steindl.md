## Specifications
Model used: Claude Default

# Prompt 1 - 18:00, 5.11.2026
We aim to implement multiple functions inside @file:useConferenceData.js which are supposed to read the data entries in 
@file:conference-data.json for a Conference Management app. The four main components have already been made which are
@file:Conference.vue for the individual conferences, @file:ConferenceList.vue for every conference inside the json file,
@file:SpeakerProfile.vue for the individual speakers and finally  @file:MyProgram.vue for a personalized program of 
conferences made by the user. What functionality do we need in order to support all four components and correctly read 
the data?

# Output

Two things to fix first
1. JSON.parse(conferenceData) will throw. Vite already turns a .json import into a JavaScript object, so passing that object to JSON.parse fails with Unexpected token o. Use the import directly. ConferenceList.vue already does this.
2. The JSON holds one conference, not many. The file describes a single event ("FrontendNow") with 20 sessions. So ConferenceList.vue really lists sessions and Conference.vue shows one session. You can keep the component names, but the composable should use the data's own terms (sessions, speakers, tracks, rooms) so the code stays clear.

### What the data looks like

The sessions point to everything else by ID: trackId, roomId and speakerIds. Speakers point back to sessions through sessionIds. This means each component has to turn IDs into full objects. The composable's main job is to do that lookup once, in one place.
The links are stored in both directions (session.speakerIds and speaker.sessionIds), so they could get out of sync. I'd treat session.speakerIds as the single source of truth and work out a speaker's sessions from it. They match in the current data, but this rules out drift later.

### Functions needed per component

Shared basics (used by all four)

- conference: name, tagline, dates, location, timezone (for the header and footer)
- sessions, speakers, tracks, rooms: the raw arrays
- Lookup maps by ID: getSessionById, getSpeakerById, getTrackById, getRoomById
- resolveSession(session) → returns the session with track, room and speakers[] filled in. Every component that shows a session needs this.
- 
ConferenceList.vue (all sessions)

- getAllSessions(): resolved and sorted by day and then startTime
- filterSessions({ query, trackId, day, level, format }): SearchBar.vue is there for this. The search should check the title, the abstract and the speaker names.
- groupSessionsByDay(sessions) and possibly groupByTimeslot: three sessions often run at the same time (for example 10:15 in room-a, room-b and room-c), so a time-slot layout makes sense
- Values for the filter dropdowns: tracks, conference.dates, and the distinct level values (Einsteiger, Fortgeschritten, Experte) and format values (Vortrag, Workshop, Podium)

Conference.vue (one session)
- getSessionDetails(id): the resolved session, or null when the ID doesn't exist (needed for a not-found state)
- Optional: getParallelSessions(session), the other sessions in the same time slot

SpeakerProfile.vue
- getSpeakerById(id)
- getSessionsBySpeaker(speakerId): resolved sessions, worked out from session.speakerIds
- Optional: getCoSpeakers(speakerId). Session s20 is a panel with four speakers.

MyProgram.vue (personal schedule)

This needs state as well as reading data. useLocalStorage.js exists but is empty, so it can store the saved session IDs.
- myProgramIds: a reactive list of IDs saved to localStorage
- addToProgram(id), removeFromProgram(id), isInProgram(id) (also used by the add/remove button in Conference.vue and ConferenceList.vue)
- myProgram: computed, resolved, sorted and grouped by day
- getConflicts(program): finds overlapping sessions on the same day, which is likely given the parallel tracks. To check for overlap, compare the "HH:MM" strings or convert them to minutes.

# Prompt 2 - 18:10, 5.11.2026
How would you go about an implementation of the suggested structure and why have you done what you have done? 
Additionally, we do not need full functionality of the components yet, just the functions for the javascript files since
that will be added later

# Output

I wrote two files: src/composables/useConferenceData.js and src/composables/useLocalStorage.js. Components are untouched. I ran the composable in Node against the real JSON and every function returned the expected result:

- all 20 sessions come back resolved
- searching "composable" finds s12
- s02 runs at the same time as s03 and s04
- sp01's sessions are s01 and s20
- a saved list containing s02 and s03 is flagged as a conflict

The Vite app itself hasn't been run yet.

I also tried to create a third file, useMyProgram.js, for the saved-program state. You declined that, so it doesn't exist. Separately, useConferenceData.js was emptied between my read and my write (by you or the editor), so I wrote it from scratch.
### What's in useConferenceData.js and why

1. Import the JSON directly, without JSON.parse. Vite already turns the JSON into a JavaScript object, so parsing it again would throw an error.
2. Do the work once, when the file first loads. The data never changes, so the composable:
   - builds ID → object maps (Maps) for sessions, speakers, tracks and rooms, so each lookup is instant instead of searching an array every time
   - fills in every session once with track, room and speakers[], and sorts them by date and start time
   
   Every component then gets the same ready-made objects. Nothing needs Vue reactivity here because nothing changes.
3. One place that turns IDs into objects (resolveSession). Sessions only store trackId, roomId and speakerIds. Filling those in here means the templates can just write session.room.name, and no component has to do its own lookups.
4. session.speakerIds is the only source of truth. The JSON stores the speaker–session link twice, so getSessionsBySpeaker works it out from the sessions rather than trusting speaker.sessionIds. If the two ever disagree, the app still behaves consistently.
5. Functions grouped by the component that uses them:

   All:
   - conference
   - sessions
   - speakers
   - tracks
   - rooms
   - getSessionById
   - getSpeakerById
   - getTrackById
   - getRoomById
   
   ConferenceList:
   - getAllSessions
   - -filterSessions({ query, trackId, day, level, format })
   - groupSessionsByDay
   - groupSessionsByTimeslot
   - filterOptions
   
   Conference:
   - getParallelSessions(idOrSession)
   
   SpeakerProfile:
   - getSessionsBySpeaker
   - getCoSpeakers
   
   MyProgram:
   - getSessionsByIds(ids)
   - findConflicts(sessions)
6. Plain functions that take inputs and return results. They don't hold any state and don't use ref or computed. A component can later wrap them, e.g. computed(() => filterSessions(filters.value)). This also makes them easy to test, as the Node check showed.
7. Small details:
   - Lookups return null for unknown IDs, so components can show a "not found" message instead of crashing.
   - filterOptions is built from the data, so the dropdowns never offer stale values.
   - Dates like 2026-09-15 and times like 09:00 sort correctly as plain text.
   - The overlap check lives in one helper, overlaps, which both getParallelSessions and findConflicts use.
### useLocalStorage.js
   useLocalStorage(key, defaultValue) gives you a Vue ref that:
   - loads its starting value from localStorage
   - saves itself back automatically whenever it changes, including changes inside arrays and objects
   
It doesn't crash on a corrupt entry, a full storage quota, or when there is no window (e.g. server-side rendering, which your rendering-strategy ADR may involve).
   
### Still open: where the saved-program state lives
MyProgram.vue needs a shared list of saved session IDs plus add, remove and toggle actions. I wouldn't put that in useConferenceData, which only reads data. That's why I tried to create useMyProgram.js, which uses useLocalStorage(...) once at file level so every component shares the same list. Should I create that file after all, or would you rather keep the state somewhere else (e.g. in MyProgram.vue itself until the components are built)?