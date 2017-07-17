import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
let routes = [
    {
        path: '/',
        component: login
    },
    {
        path : '/manage',
        component : manage,
        children : [
            {
                path : '',
                component : home,
                meta : []
            }
        ]
    }
]

export default new Router({
  routes
})
