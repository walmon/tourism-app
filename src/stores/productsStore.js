import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import productsData from './products.json'

export const useProductsStore = defineStore('products', () => {
  const products = ref(productsData)

  return { getProduct: (id) => products.value.find(product => product.id === id || true),
    products: computed(() => products.value),
   }
})
