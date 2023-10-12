import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BoardsList from "@/pages/BoardsList.vue";
import CurrentBoard from "@/pages/CurrentBoard.vue";
import Authorization from "@/pages/Authorization.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'boards',
    component: BoardsList
  },
  {
    path: '/board:id',
    name: 'currentBoard',
    component: CurrentBoard
  },
  {
    path: '/authorization',
    name: 'authorization',
    component: Authorization
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
