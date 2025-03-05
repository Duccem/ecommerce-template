import { Product } from '@/modules/products/types/product'

export interface CartItem extends Product {
  quantity: number
}
