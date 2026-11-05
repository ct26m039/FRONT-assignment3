import { ref, watch } from 'vue'

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

function read(key, defaultValue) {
  if (!isBrowser) return defaultValue
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? defaultValue : JSON.parse(raw)
  } catch {
    // Corrupt or manually edited entry: fall back instead of crashing the app.
    return defaultValue
  }
}

/**
 * A ref that is initialised from localStorage and written back on every change.
 * Values are stored as JSON, so arrays and objects work too.
 */
export function useLocalStorage(key, defaultValue) {
  const state = ref(read(key, defaultValue))

  watch(
    state,
    (value) => {
      if (!isBrowser) return
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // Quota exceeded or storage disabled (e.g. private mode): keep in-memory state.
      }
    },
    { deep: true }
  )

  return state
}
