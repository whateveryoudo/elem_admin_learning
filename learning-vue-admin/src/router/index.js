import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const shopList = r => require.ensure([], () => r(require('@/page/shopList')), 'shopList');
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
const addShops = r => require.ensure([], () => r(require('@/page/addShops')), 'addShops');
const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList');
//图表
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
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
            },
            {
                path : '/userList',
                component : userList,
                meta : ['数据管理','用户列表']
            },
            {
                path : '/shopList',
                component : shopList,
                meta : ['数据管理','商家列表']
            },
            {
                path : '/addGoods',
                component : addGoods,
                meta : ['添加数据','添加商品']
            },
            {
                path : '/addShops',
                component : addShops,
                meta : ['添加数据','添加商铺']
            },
            {
                path : '/foodList',
                component : foodList,
                meta : ['数据管理','食品列表']
            },
            {
                path : '/visitor',
                component : visitor,
                meta : ['图表','用户分布']
            }
        ]
    }
]

export default new Router({
  routes,
    strict: process.env.NODE_ENV !== 'production',
})
