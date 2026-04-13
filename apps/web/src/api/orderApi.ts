import { TCartItem, UserState } from '../features/userSlice';
import { Product } from '../types/Product';
import { User } from '../types/User';
import { ClientApi } from './apiRequest';

export type OrderItemPayload = {
  productId: string
  quantity: number
  size: string
}

export type OrderPayload = {
  userId?: string
  items: OrderItemPayload[]
  shippingAddress: string
  paymentMethod: string
}

export type responseOrder = {
  success: boolean;
  moreInfo: {
    products: Product[]
  }
  data: OrderItem[]
}


export type OrderItem = {
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

export type Item = {
  _id: string
  name: string
  quantity: number
  image: string[]
  price: number
  totalPrice: number
  size: string
}



export const orderApi = {
  async createOrder(payload: OrderPayload): Promise<any> {
    try {
      const response = await ClientApi.axiosPost({
        data: {
          endpoint: `/api/order`,
          params: payload
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrders(id: string): Promise<responseOrder> {
    try {
      const response = await ClientApi.axiosGet({
        data: {
          endpoint: `/api/order/${id}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
};
