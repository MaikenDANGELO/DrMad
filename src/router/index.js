import Vue from 'vue'
import VueRouter from 'vue-router'
import BankAccountView from "@/views/BankAccountView.vue";
import ShopView from '@/views/ShopView.vue';
import ShopHome from '@/views/ShopHome.vue';
import ShopLoginView from '@/views/ShopLoginView.vue';
import ShopBuy from '@/views/ShopBuy.vue';
import ShopPay from '@/views/ShopPay.vue';
import ShopOrders from '@/views/ShopOrders.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/shop'
  },
  {
    path: '/bank/account',
    name: 'bankaccount',
    component: BankAccountView
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
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
