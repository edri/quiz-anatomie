import { createRouter, createWebHistory } from 'vue-router'
import Quiz from '../views/Quiz.vue'

const routes = [
  {
    path: '/',
    name: 'Quiz',
    component: Quiz
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
