import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/pages/LoginPage.vue"
import ShiftsPage from "@/pages/ShiftsPage.vue"
import WatchmenPage from "@/pages/WatchmenPage.vue"
import PermissionsPage from "@/pages/PermissionsPage.vue"
import DivisionsPage from "@/pages/DivisionsPage.vue"
import EmployeesPage from "@/pages/EmployeesPage.vue"
import AudiencesPage from "@/pages/AudiencesPage.vue"

const routes = [
  {
    path: '/',
    name: 'auth',
    component: LoginPage
  },
  {
    path: '/shifts',
    name: 'shifts',
    component: ShiftsPage
  },
  {
    path: '/employees',
    name: 'employees',
    component: EmployeesPage
  },
  {
    path: '/audiences',
    name: 'audiences',
    component: AudiencesPage
  },
  {
    path: '/watchmen',
    name: 'watchmen',
    component: WatchmenPage
  },
  {
    path: '/permissions',
    name: 'permissions',
    component: PermissionsPage
  },
  {
    path: '/divisions',
    name: 'divisions',
    component: DivisionsPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
