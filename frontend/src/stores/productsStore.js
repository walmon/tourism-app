import { defineStore } from 'pinia'
import { CDN } from '@/vars'

export const useProductsStore = defineStore('products', () => {
  return {
    getProduct,
  }

  async function getProduct(id) {

    const response = await fetch(`${CDN}${id}.json`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product ${id}: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  }
})
