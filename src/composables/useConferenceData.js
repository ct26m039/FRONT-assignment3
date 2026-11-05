import data from '../assets/data/conference-data.json'

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
 * All criteria are optional; empty values are ignored.
 * `query` matches title, abstract and speaker names (case-insensitive).
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
    const key = `${s.day} ${s.startTime}`
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
