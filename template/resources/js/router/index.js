import { createRouter, createWebHistory } from "vue-router"
import FileManager from "../components/FileManager.vue"
import Login from "../components/auth/Login.vue"
import Register from "../components/auth/Register.vue"
import store from "../store"

const routes = [
  {
    path: "/",
    name: "home",
    component: FileManager,
    meta: { requiresAuth: true },
  },
  {
    path: "/files",
    name: "files",
    component: FileManager,
    meta: { requiresAuth: true },
  },
  {
    path: "/files/recent",
    name: "recent",
    component: FileManager,
    meta: { requiresAuth: true },
  },
  {
    path: "/files/shared",
    name: "shared",
    component: FileManager,
    meta: { requiresAuth: true },
  },
  {
    path: "/files/favorites",
    name: "favorites",
    component: FileManager,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { guest: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next({ name: "login" })
    } else {
      next()
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next({ name: "home" })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
