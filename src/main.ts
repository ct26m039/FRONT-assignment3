import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
<<<<<<< HEAD
import { router } from './router' 

const app = createApp(App)
app.use(router)                  
app.mount('#app')
=======
import { router } from './router'

createApp(App).use(router).mount('#app')
>>>>>>> bf312a7b85ef65c118046febc89e267b4a7d401c
