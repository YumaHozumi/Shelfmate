import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppTop from '@/views/AppTopView.vue'
import { onAuthStateChanged, getAuth } from 'firebase/auth'

const routeSettings: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'AppTop',
    component: AppTop,
    meta: { requireAuth: true }
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
    path: "/series/:id",
    name: "Series",
    props: true,
    component: () => import("@/views/SeriesView.vue"),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings
})

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  if(requireAuth) {
    onAuthStateChanged(getAuth(), (user) => {
      if(user) {
        next()
      }
      else next({name: "Login"});
    })
  } else {
    next();
  }
})

export default router
