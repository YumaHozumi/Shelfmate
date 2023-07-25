import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppTop from '@/views/AppTopView.vue'

const routeSettings: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'AppTop',
    component: AppTop
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue")
  },
  {
    path: "/test",
    component: () => import("@/views/SeriesView.vue")
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings
})

export default router
