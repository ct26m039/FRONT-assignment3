import {useLocalStorage} from "./useLocalStorage.js";
import { useConferenceData} from "./useConferenceData.js";
import {computed} from "vue";

const { getSessionsByIds, findConflicts } = useConferenceData();
const savedSessions = useLocalStorage('savedSessions', [])

const sessions = computed(() => getSessionsByIds(savedSessions.value))
const conflicts = computed(() => findConflicts(sessions.value))
const count = computed(() => savedSessions.value.length)

function isSaved(id) {
    return savedSessions.value.includes(id);
}

function add(id) {
    if (!sessions.value.includes(id) && isSaved(id)) {
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