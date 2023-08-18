import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppTop from '@/views/AppTopView.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth, getCurrentUser } from '@/config/firebase'

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
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/series/:id',
    name: 'Series',
    props: true,
    component: () => import('@/views/SeriesView.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchBookView.vue'),
    meta: { requireAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings
})

router.beforeEach((to, from, next) => {
  console.log('route')
  console.log(to)
  const requireAuth = to.matched.some((record) => record.meta.requireAuth)
  if (requireAuth) {
      const user = firebaseAuth.currentUser
      console.log(firebaseAuth)
      if (user) {
        console.log("next now")
        next()
      } else next({ name: 'Login' })
  } else {
    console.log("next here")
    next()
  }
  console.log("routing finish")
})

export default router
