export type TOrderItemt = {
  _id: string
  user: User
  items: Item[]
  totalPrice: number
  discount: number
  shippingAddress: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  __v: number
}

type User = {
  _id: string
  phone: string
  avatar: string
  userName: string
  email: string
}

type Item = {
  _id: string
  name: string
  quantity: number
  image: string[]
  price: number
  discountPercent: number
  totalPrice: number
  size: string
  discountPrice: number
}

// export interface OrderItem {
//   _id: string;
//   name: string;
//   quantity: number;
//   price: number;
//   size: string;
//   image?: string[];
//   discountPercent?: number;
//   totalPrice?: number;
// }

export interface OrderItem {
  productId?: string
  name?: string
  description?: string
  price?: number
  discountPercent?: number
  image?: string[]
  discountPrice?: number
  category?: string
  brand?: string
  size?: string
  rating?: number
  status?: boolean
  createdAt?: string
  updatedAt?: string
  quantity?: number
}
