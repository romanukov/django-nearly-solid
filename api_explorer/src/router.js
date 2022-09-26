import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        name: 'entities',
        path: '/entities',
        component: () => import('@/pages/entities')
    },
    {
        name: 'services',
        path: '/services',
        component: () => import('@/pages/services')
    },
    {
        name: 'settings',
        path: '/settings',
        component: () => import('@/pages/settings')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
