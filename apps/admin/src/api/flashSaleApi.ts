import { AdminApi } from "./apiRequest";

export const flashSaleApi = {
  getFlashSales: async () => {
    try {
      const response = await AdminApi.axiosGet({
        data: {
          endpoint: "/api/flash-sale",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching flash sales:", error);
      throw error;
    }
  },

  createFlashSale: async (data: any) => {
    try {
      const response = await AdminApi.axiosPost({
        data: {
          endpoint: "/api/flash-sale",
          body: data,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating flash sale:", error);
      throw error;
    }
  },

  updateFlashSale: async (id: string, data: any) => {
    try {
      const response = await AdminApi.axiosPut({
        data: {
          endpoint: `/api/flash-sale/${id}`,
          body: data,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating flash sale:", error);
      throw error;
    }
  },

  deleteFlashSale: async (id: string) => {
    try {
      const response = await AdminApi.axiosDelete({
        data: {
          endpoint: `/api/flash-sale/${id}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting flash sale:", error);
      throw error;
    }
  },
};
