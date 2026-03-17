import { AdminApi } from "../../../api/apiRequest";
import { TProduct } from "../../../models/Product.model";

const ProductApi = {

  getProduct: async (payload?: any): Promise<any> => {
    try {
      const response = await AdminApi.axiosGet({
        data: {
          endpoint: "/api/product/get",
          params: payload,
        },
      });

      return response.data;

    } catch (error) {
      console.error("getProduct error:", error);
      throw error;
    }
  },

  createProduct: async (payload: TProduct): Promise<any> => {
    try {

      const response = await AdminApi.axiosPost({
        data: {
          endpoint: "/api/product",
          body: payload,
        },
      });

      return response.data;

    } catch (error) {
      console.error("createProduct error:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, payload: TProduct): Promise<any> => {
    try {

      const response = await AdminApi.axiosPut({
        data: {
          endpoint: `/api/product/${id}`,
          body: payload,
        },
      });

      return response.data;

    } catch (error) {
      console.error("updateProduct error:", error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<any> => {
    try {

      const response = await AdminApi.axiosDelete({
        data: {
          endpoint: `/api/product/${id}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("deleteProduct error:", error);
      throw error;
    }
  },

};

export default ProductApi;
