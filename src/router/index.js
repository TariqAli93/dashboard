import Vue from 'vue'
import VueRouter from 'vue-router'
import Accounts from '../components/Accounts.vue'
import Users from '../components/Users.vue'
import Categories from '../components/Categories.vue'
import Services from '../components/Services.vue'
import Support from '../components/Support.vue'
import Home from '../components/Home.vue'
import Print from '../components/Print.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: Accounts
  },
  {
    path: '/users',
    name: 'users',
    component: Users
  },
  {
    path: '/categories',
    name: 'categories',
    component: Categories
  },
  {
    path: '/services',
    name: 'services',
    component: Services
  },
  {
    path: '/supports',
    name: 'supports',
    component: Support
  },
  {
    path: '/print',
    name: 'print',
    component: Print
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
