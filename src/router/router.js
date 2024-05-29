import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from "@/pages/LoginPage.vue"
import ShiftsPage from "@/pages/ShiftsPage.vue"
import WatchmenPage from "@/pages/WatchmenPage.vue"
import PermissionsPage from "@/pages/PermissionsPage.vue"
import DivisionsPage from "@/pages/DivisionsPage.vue"
import EmployeesPage from "@/pages/EmployeesPage.vue"
import AudiencesPage from "@/pages/AudiencesPage.vue"
import {authModule as auth} from "@/store/authModule"

const routes = [
    {path: '/auth', name: 'auth', component: LoginPage},
    {path: '/shifts', name: 'shifts', component: ShiftsPage, meta: {requiresAuth: true}},
    {path: '/employees', name: 'employees', component: EmployeesPage, meta: {requiresAuth: true}},
    {path: '/audiences', name: 'audiences', component: AudiencesPage, meta: {requiresAuth: true}},
    {path: '/watchmen', name: 'watchmen', component: WatchmenPage, meta: {requiresAuth: true}},
    {path: '/permissions', name: 'permissions', component: PermissionsPage, meta: {requiresAuth: true}},
    {path: '/divisions', name: 'divisions', component: DivisionsPage, meta: {requiresAuth: true}},
    {path: '/:pathMatch(.*)*', redirect: '/auth',},
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!auth.state.isAuthenticated) {
            next({
                path: '/auth',
                query: {redirect: to.fullPath}
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
