import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes, routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes,...routes],
  scrollBehavior(){
    return {
      left:0,
      top:0
    }
  }
})

export default router
