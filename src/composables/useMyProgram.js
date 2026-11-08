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
