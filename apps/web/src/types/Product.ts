export interface Product {
  _id: string
  name: string
  description: string
  price: number
  discountPercent: number
  image: string[]
  discountPrice: number
  category: string
  brand: string
  sizes: string[]
  rating: number
  status: boolean
  createdAt: string
  updatedAt: string
}
