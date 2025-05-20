import { createRouter, createWebHistory } from 'vue-router'
import ButtonMain from '@/views/ButtonMain.vue'
import { useAuthProvider } from '@/stores/auth-provider'
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
      meta: { requiresAuth: true }, // ✅ proteksi admin layout
      children: [
        {
          path: 'menumanaje',
          name: 'menumanaje',
          component: MenuManage,
          meta: { requiresAuth: true },
        },
        {
          path: 'home',
          name: 'home',
          component: () => import('../components/admin/home/HomeMain.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'cashier',
          name: 'cashier',
          component: () => import('../components/admin/cashier/CashierMain.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'orders',
          component: TableMain,
          meta: { requiresAuth: true },
        },
        {
          path: 'manage',
          name: 'manage',
          component: TableManajer,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

// ✅ Proteksi route pakai beforeEach
// router.beforeEach((to, from, next) => {
//   const auth = useAuthProvider()
//   const isAuthenticated = auth.isAuthenticated || localStorage.getItem('accessToken')

//   // Cegah user login mengakses halaman login lagi
//   if (to.path === '/login' && isAuthenticated) {
//     next('/admin/home')
//   }

//   // Jika butuh login & belum login
//   else if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
//     next('/login')
//   }

//   // Lanjutkan ke route yang dituju
//   else {
//     next()
//   }
// })

export default router
