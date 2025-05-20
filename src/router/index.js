import { createRouter, createWebHistory } from 'vue-router'
import ButtonMain from '@/views/ButtonMain.vue'
import CartMain from '@/views/CartMain.vue'
import DetailProduct from '@/views/DetailProduct.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import LoginAuth from '@/components/user/FormAuth/LoginAuth.vue'
import OrderDetail from '@/components/admin/home/penjualan/Detail/OrderDetailTake.vue'
import OrderDetailDine from '@/components/admin/home/penjualan/Detail/OrderDetailDine.vue'
import TableMain from '@/components/admin/orders/TableMain.vue'
import CekDineIn from '@/components/admin/home/penjualan/CekDineIn.vue'
import TableManajer from '@/components/admin/manage/TableManajer.vue'
import MenuManage from '@/components/admin/menu/MenuManage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/home'
    },
    {
      path: '/payment/:id',
      name: 'CekDineIn',
      component: CekDineIn,
    },
    {
      path: '/order-detail-dine/:id',
      name: 'OrderDetailDine',
      component: OrderDetailDine,
    },
    {
      path: '/order-detail-take/:id',
      name: 'OrderDetail',
      component: OrderDetail,
    },
    {
      path: '/:table_id/:umkm_id/menu',
      name: 'menu',
      component: ButtonMain,
    },
    {
      path: '/:table_id/:umkm_id/cart',
      name: 'cart',
      component: CartMain,
    },
    {
      path: '/detail-produk/:product_id',
      name: 'detail',
      component: DetailProduct,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginAuth,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      children: [
        {
          path: 'menumanaje',
          name: 'menumanaje',
          component: MenuManage,
        },
        {
          path: 'home',
          name: 'home',
          component: () => import('../components/admin/home/HomeMain.vue'),
        },
        {
          path: 'cashier',
          name: 'cashier',
          component: () => import('../components/admin/cashier/CashierMain.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: TableMain,
        },
        {
          path: 'manage',
          name: 'manage',
          component: TableManajer,
        },
      ],
    },
  ],
})

export default router
