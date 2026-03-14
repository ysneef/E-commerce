import { AdminApi } from "../../../api/apiRequest"

const OrderApi = {
  getOrder: async (payload: any): Promise<any> => {
    const response = await AdminApi.axiosGet({
      data: {
        endpoint: "/api/order/get",
        params: payload,
      },
    })

    return response.data
  },
  createOrder: async (payload: any): Promise<any> => {
    const response = await AdminApi.axiosPost({
      data: {
        endpoint: '/api/order',
        params: payload,
      },
    })

    return response.data
  },
  updateOrder: async (id: string, payload: any): Promise<any> => {
    const response = await AdminApi.axiosPut({
      data: {
        endpoint: `/api/order/${id}`,
        params: payload,
      },
    })

    return response.data
  },

  deleteOrder: async (id: string): Promise<any> => {
    const response = await AdminApi.axiosDelete({
      data: {
        endpoint: `/api/order/${id}`,
        params: {},
      },
    })

    console.log("response:",response)

    return response.data
  },
}

export default OrderApi
