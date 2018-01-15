import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Search from '@/components/Search'
import OrderList from '@/components/OrderList'
import MyCenter from '@/components/MyCenter'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/OrderList',
      name: 'OrderList',
      component: OrderList
    },
    {
      path: '/MyCenter',
      name: 'MyCenter',
      component: MyCenter
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    }
  ]
})
