import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TOrderItemt } from "../types/Order"

export type UserState = {
  _id?: string
  userName: string
  email: string
  avatar?: string
  address?: string
  phone?: string
  role?: string
  totalCart?: number
  cart?: TCartItem[]
  orders?: TOrderItemt[];
}

export type TCartItem = {
  _id: string,
  productId: string,
  name: string,
  quantity: number,
  image:string[],
  price: number,
  discountPercent: number,
  totalPrice: number,
  size: string,
  discountPrice: number,
}

const initialState: UserState = {
  userName: "",
  email: "",
  avatar: "",
  address: "",
  phone: "",
  role: "",
  totalCart: 0
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload }
    },    
    clearUser: () => initialState,
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
