import { TProduct } from "../../productManagement/models/Product.model"

export interface TOrder {
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

export interface User {
  // _id: string
  userName: string
  email: string
  phone: string
  avatar: string
}

export interface Item {
  _id: string
  name: string
  quantity: number
  price: number
  size: string
}

export interface IProductOrder extends TProduct {
  name: string,
  image: string[],
  quantity: number,
  discountPercent: number,
  price: number,
  totalPrice: number,
  size: string
}
