import { createRouter, createWebHistory } from 'vue-router'

// Dynamische Imports (Lazy Loading) verhindern Abstürze, 
// falls Person 1 noch an einer Datei arbeitet
const routes = [
  { 
    path: '/', 
    component: () => import('./components/ConferenceList.vue') 
  },
  { 
    path: '/sessions/:id', 
    component: () => import('./components/Conference.vue') 
  },
  { 
    path: '/speakers/:id', 
    component: () => import('./components/SpeakerProfile.vue') 
  },
  { 
    path: '/my-program', 
    component: () => import('./components/MyProgram.vue') 
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})