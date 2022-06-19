import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

import Playground from "@/components/Playground.vue"
import About from "@/components/About.vue"

const routeNames = {
  Playground: "playground",
  About: "about",
}

const routeDefinitions: RouteRecordRaw[] = [
  {
    path: "/",
    component: Playground,
    name: routeNames.Playground,
  },
  {
    path: "/about",
    component: About,
    name: routeNames.About,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routeDefinitions,
})

export { router, routeDefinitions, routeNames }
