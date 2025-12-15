import { defineStore } from 'pinia'
import { CDN } from '@/vars'

export const useProductsStore = defineStore('products', () => {
  return {
    getProduct,
  }

  async function getProduct(id) {

    const response = await fetch(`${CDN}${id}.json`)
    const data = await response.json()
    return data
  }
})
