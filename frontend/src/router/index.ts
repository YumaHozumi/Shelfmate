import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppTop from '@/views/AppTopView.vue'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseAuth } from '@/config/firebase'

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
  const requireAuth = to.matched.some((record) => record.meta.requireAuth)
  if (requireAuth) {
    // Promiseを使って認証状態の確認を非同期に行う
    new Promise<User | null>((resolve) => {
      onAuthStateChanged(firebaseAuth, (user) => {
        resolve(user) // ユーザー情報またはnullを解決
      })
    }).then((user) => {
      if (user) {
        if (user.emailVerified) next() // 認証済みの場合は次へ進む
        else next({ name: 'Login' })
      } else {
        next({ name: 'Login' }) // 未認証の場合はログインページへ
      }
    })
  } else {
    next()
  }
})

export default router
