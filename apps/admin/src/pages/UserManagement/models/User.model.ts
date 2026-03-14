export type TUser = {
  _id: string
  userName: string
  avatar: string
  email: string
  password: string
  address: string
  phone: string
  order: any[]
  cart: any[]
  role: "admin" | "user"
  createdAt: string
  updatedAt: string
}
