export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  inStock: boolean
  color?: string
  size?: string
}
