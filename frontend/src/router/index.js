import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/home/Home.vue'
import Product from '../pages/product/Product.vue'
import NotFound from '../pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/p/:id',
      name: 'product',
      component: Product,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    }
  ],
})

export default router
