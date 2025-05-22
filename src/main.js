import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'

console.log('API URL:', import.meta.env.VITE_API_URL)

// ICONS
import {
  FaFlag,
  RiZhihuFill,
  LaShoppingCartSolid,
  BiPlusSquare,
  GiBowlOfRice,
  GiCoffeeCup,
  IoArrowBackCircle,
  BiShop,
  BiChatLeftHeart,
  MdRestaurantmenuOutlined,
  BiCashCoin,
  IoDocumentTextSharp,
  RiLogoutCircleLine,
  BiPrinter,
  MdSkipnextRound,
  MdSkippreviousRound,
} from 'oh-vue-icons/icons'

addIcons(
  FaFlag,
  RiZhihuFill,
  GiBowlOfRice,
  IoArrowBackCircle,
  GiCoffeeCup,
  LaShoppingCartSolid,
  BiPlusSquare,
  BiShop,
  BiChatLeftHeart,
  MdRestaurantmenuOutlined,
  BiCashCoin,
  IoDocumentTextSharp,
  RiLogoutCircleLine,
  BiPrinter,
  MdSkipnextRound,
  MdSkippreviousRound,
)

const app = createApp(App)
app.use(VueQueryPlugin)
app.use(createPinia())
app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
