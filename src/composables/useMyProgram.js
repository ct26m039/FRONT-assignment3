import {useLocalStorage} from "./useLocalStorage.js";

const savedSessions = useLocalStorage('savedSessions', [])

function isSaved(id) {
    return id in savedSessions;
}

function add(id) {
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