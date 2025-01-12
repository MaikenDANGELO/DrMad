import Vue from 'vue'
import VueRouter from 'vue-router'
import BankAccountView from '@/views/BankAccountView.vue';
import ShopView from '@/views/ShopView.vue';
import ShopHome from '@/views/ShopHome.vue';
import ShopLoginView from '@/views/ShopLoginView.vue';
import ShopBuy from '@/views/ShopBuy.vue';
import ShopPay from '@/views/ShopPay.vue';
import ShopOrders from '@/views/ShopOrders.vue';
import BankView from '@/views/BankView.vue';
import BankHome from '@/views/BankHome.vue';
import BankAmount from '@/views/BankAmount.vue';
import BankOperation from '@/views/BankOperation.vue'
import MainHome from '@/views/MainHome.vue'
import BankHistory from '@/views/BankHistory.vue'
import ShopLogout from '@/views/ShopLogout.vue';
import BankLogout from '@/views/BankLogout.vue';


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // redirect: '/shop',
    component: MainHome,
  },
  {
    path: "/shop",
    name: 'shopView',
    component: ShopView,
    children: [
      {
        path: 'home',
        components: {
          shopmain: ShopHome
        },
        alias: ''
      },
      {
        path: 'login',
        components: {
          shopmain: ShopLoginView
        }
      },
      {
        path: 'buy',
        components: {
          shopmain: ShopBuy
        }
      },
      {
        path: 'pay/:orderId',
        components: {
          shopmain: ShopPay
        },
        props: {
          shopmain: true
        }
      },
      {
        path: 'pay',
        components: {
          shopmain: ShopPay
        },
        props: {
          shopmain: true
        }
      },
      {
        path: 'orders',
        components: {
          shopmain: ShopOrders
        }
      },
      {
        path: 'logout',
        components: {
          shopmain: ShopLogout
        }
      }
    ]
  },
  {
    path: '/bank',
    component: BankView,
  
    children: [
      {
        path: '',
        alias: 'home',
        components: {
          bankmain:BankHome
        },
      },
      {
        path: 'amount',
        components: {
          bankmain: BankAmount
        },
      },
      {
        path: 'account',
        components: {
          bankmain: BankAccountView
        }
      },
      {
        path: 'operation',
        components: {
          bankmain: BankOperation
        },
      },
      {
        path: 'history',
        components: {
          bankmain: BankHistory,
        }
      },
      {
        path: 'logout',
        components: {
          bankmain: BankLogout,
        }
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
