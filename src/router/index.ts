import { createRouter, createWebHashHistory } from 'vue-router'
import ConferenceList from '../components/ConferenceList.vue'
import Conference from '../components/Conference.vue'
 
// Hash history (/#/sessions/s01) because the app is served from a static host
// under a sub-path (see `base` in vite.config.ts); deep links and page reloads
// then work without any server-side rewrite rules.
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'sessions', component: ConferenceList },
    // `props: true` passes the :id param to Conference.vue as a prop,
    // so the component doesn't need to know about the router.
    { path: '/sessions/:id', name: 'session', component: Conference, props: true },
    // One profile page per speaker (/#/speakers/sp01 ... sp18), same `props: true` pattern.
    {
      path: '/speakers/:id',
      name: 'speaker',
      component: () => import('../components/SpeakerProfile.vue'),
      props: true,
    },
    { path: '/program', name: 'program', component: () => import('../components/MyProgram.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})