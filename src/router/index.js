import { createRouter, createWebHistory } from 'vue-router'
import Os from '../views/Os.vue'
import Muscles from '../views/Muscles.vue'

const routes = [
  {
    path: '/',
    redirect: '/os',
  },
  {
    path: '/os',
    name: 'Os',
    component: Os
  },
  {
    path: '/muscles',
    name: 'Muscles',
    component: Muscles
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
