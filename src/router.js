import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Start',
      component: () => import('./views/Start.vue')
    },
    {
      path: '/:package',
      name: 'Package',
      component: () => import('./views/Start.vue')
    }
  ]
})
