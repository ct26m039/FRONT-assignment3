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

# Prompt 3 - 11:00, 7.11.2026

I'm attempting to import @file:useConferenceData.js in order to implement the detailed Coference page component. 
it needs to have a specific route per individual conference session (like /sessions/[id]) with a title, an abstract, 
the timeframe, the room it's located in, the track, the level of difficulty, the format and the associated speakers. 
All 20 sessions should be functional

# Output

The session detail page now works at /#/sessions/s01 through /#/sessions/s20. Type-checking passes. The production build (npm run build) still fails, because of a separate bug in MyProgram.vue (more on that below).
Why your import didn't work
- Conference.vue was importing useConferenceData from useLocalStorage, and that file doesn't have it. It now imports from ../composables/useConferenceData.
- vue-router wasn't installed, so there was no way to have a /sessions/:id route. I installed it, which updated package.json and package-lock.json.
- tsconfig.app.json didn't allow JS files, so vue-tsc refused to import a .js composable into a script lang="ts" component. I added "allowJs": true.

What I added or changed
- src/router/index.ts (new) has three routes:
- / shows the session list.
- /sessions/:id shows Conference.vue, with the ID passed in as a prop.
- /program shows MyProgram.vue.

Unknown URLs go back to /. I used hash URLs (/#/sessions/s05) because your Vite base suggests a static host like GitHub Pages. With normal URLs, reloading a session page there would give a 404.
- main.ts / App.vue: the app now uses the router, and App.vue shows <RouterView /> instead of always showing MyProgram.
- Conference.vue shows the title, abstract, date and time, room, track, level, format, and every speaker with their title, company and bio. An unknown ID shows a "Session not found" message. The session is a computed value, so going from one session to another updates the page.
- ConferenceList.vue: each title now links to its detail page. 

How I checked it: I loaded the composable through Vite and confirmed that all 20 IDs return a session with every field filled in and all speakers found, including the four on the s20 panel. All the new modules load on the dev server. I didn't open the pages in a browser, so please run npm run dev and click through a few.

Still broken in MyProgram.vue: I fixed the same wrong import there, but ul v-model="useConferenceData" doesn't compile, because v-model only works on form inputs. That's what stops the build. MyProgram now only loads when you visit /program, so this bug can't break the session pages in dev. I left the rest of that file alone because it looks unfinished.

I haven't committed anything.

# Prompt 4 - 12:30, 7.11.2026

I've written the code inside @file:useMyProgram.js , is anything missing and what can I improve?

# Output

Good start. You put the shared state at module level (line 6), which is the most important part, and toggle is built from isSaved/add/remove the way I suggested. But there are four bugs, and the file doesn't export anything yet, so none of it works so far. Going through it line by line:

🔴 1. Nothing is exported (missing)
The file defines functions but has no export, so no component can import them. You're missing the useMyProgram() function itself. It should be exported and should return an object with sessions, isSaved, add, remove and toggle, like the "Public API" block at the bottom of useConferenceData.js.

🔴 2. Line 8: getSessionsByIds() gets no argument
Look at its definition in useConferenceData.js: it expects the list of IDs and calls .map on it. With no argument, ids is undefined, and the first time anything reads sessions.value you get TypeError: Cannot read properties of undefined (reading 'map').
Which variable holds the IDs, and how do you read a ref's contents in plain JS?

🔴 3. Line 11: in doesn't do what you expect
In JavaScript, x in obj asks whether obj has a property named x. It doesn't check whether an array contains a value. Two problems together:
- savedSessions is the ref, not the array. The ref has a property called value, so 'value' in savedSessions is true, but 's01' in savedSessions is always false.
- Even on the array, in checks indexes: 0 in ['s05'] is true, 's05' in ['s05'] is false.

So isSaved always returns false. You need the array method that checks whether a value is present, used on the array inside the ref.

🔴 4. Lines 15 and 22: the guards compare the wrong things
sessions.value is a list of full session objects, but id is a string. [{id:'s01', ...}].includes('s01') is always false, so:
- add always returns early and never adds anything.
- remove always returns early and never removes anything.

Also, sessions only holds the saved sessions. Even if the comparison worked, add would only accept sessions that are already saved, which is the reverse of what you want.
Think about what each guard is really asking:
- add: "Is this a real session ID?" (one of the lookups in useConferenceData answers that) and "is it not saved yet?" (that's exactly isSaved).
- remove: does it need a guard at all? What happens if you filter out an ID that isn't in the list?

🟡 Improvements / missing pieces
- conflicts: a second computed using findConflicts on sessions. This gives MyProgram its overlap warning almost for free.
- count and clear(), as mentioned last time. Both are optional but useful.
- Consistency: in add you change the array in place with push, while in remove you replace it with filter. Both work, because useLocalStorage watches deeply and saves either way. Still, picking one style makes the code easier to read. If you keep both, a short comment explaining why helps.
- Naming: the variable savedSessions holds IDs, but sessions holds objects. Something like savedIds makes it obvious which is which and would have made bug #4 easier to spot. The storage key 'savedSessions' can stay, but if you rename it later, existing saved data under the old key will seem to disappear.
- Style: your import spacing is inconsistent ({useLocalStorage} vs { useConferenceData}). That's minor, but your IDE's reformat (Ctrl+Alt+L) fixes it.

How to test it yourself

Once it's exported, add the toggle button to Conference.vue, open a session and click it. Then, in DevTools under Application → Local Storage, you should see the ID appear and disappear under your key. After that, open /program and the session should be listed.
When you've made the changes, send it again and I'll check it.