import { Criteria } from '../pages/CategoryPage';
import { OrderItem } from '../types/Order';
import { Product } from '../types/Product';
import { ClientApi } from './apiRequest';

interface GetProductsResponse {
  data: Product[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
interface GetProductDetailResponse {
  data: Product;
  success:boolean
}

const ClientProductApi = {
  getClientProducts: async (params: Criteria): Promise<GetProductsResponse> => {
    try {
      const queryParams: Record<string, string | number | boolean> = {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
      };
      if (params.status !== undefined) {
        queryParams.status = params.status;
      }
      const response = await ClientApi.axiosGet({
        data: {
          endpoint: '/api/product/client/get',
          params: queryParams,
        },
      });
      return response.data;
    } catch (error: unknown) {
      console.log("🚀 ~ error:", error)
      return error?.response as any;
    }
  },

  getProductById: async (id: string): Promise<GetProductDetailResponse> => {
    try {
      const response = await ClientApi.axiosGet({
        data: {
          endpoint: `/api/product/client/${id}`,
          params: {},
        },
      });
      return response.data;
    } catch (error) {
      return error?.response as any;
    }
  },

  manageCart: async (param: OrderItem & { action: 'add' | 'update' | 'delete' }): Promise<any> => {
    try {
      const response = await ClientApi.axiosPost({
        data: {
          endpoint: `/api/users/cart`,
          params: param,
        },
      });
      return response.data;
    } catch (error) {
      return error?.response as any;
    }
  },
};

export default ClientProductApi;
