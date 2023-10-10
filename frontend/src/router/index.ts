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
    meta: { requireAuth: true, title: "本棚画面" }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: "ログイン"}
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: "新規登録"}
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchBookView.vue'),
    meta: { requireAuth: true, title: "検索画面" }
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

//const DEFAULT_TITLE = "Shelfmate"

router.afterEach((to) => {
  const title = to.meta.title
  if(typeof title === "string") document.title = title
})

export default router
