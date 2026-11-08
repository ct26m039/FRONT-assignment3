<<<<<<< HEAD
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
=======
import {useLocalStorage} from "./useLocalStorage.js";
import { useConferenceData} from "./useConferenceData.js";
import {computed} from "vue";

const { getSessionById, getSessionsByIds, findConflicts } = useConferenceData();
const savedSessions = useLocalStorage('savedSessions', [])

const sessions = computed(() => getSessionsByIds(savedSessions.value))
const conflicts = computed(() => findConflicts(sessions.value))
const count = computed(() => savedSessions.value.length)

function isSaved(id) {
    return savedSessions.value.includes(id);
}

function add(id) {
    if (!getSessionById(id) || isSaved(id)) {
        return;
    }
    savedSessions.value.push(id);
}

function remove(id) {
    savedSessions.value = savedSessions.value.filter((session) => session !== id);
}

function toggle(id) {
    if (isSaved(id)) {
        remove(id);
    } else {
        add(id);
    }
}

function clear() {
    savedSessions.value = [];
}

export function useMyProgram() {
    return {
        sessions,
        conflicts,
        count,
        isSaved,
        add,
        remove,
        toggle,
        clear
    }
}
>>>>>>> bf312a7b85ef65c118046febc89e267b4a7d401c
