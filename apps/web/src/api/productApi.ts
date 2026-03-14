import { TReviewItem } from '../pages/ProductDetailPage/components/ReviewItem';
import { Product } from '../types/Product';
import { User } from '../types/User';
import { ClientApi } from './apiRequest';

export interface FilterOptions {
  categories: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
}

interface ApiResponseGGetReviewProduct {
  success: boolean;
  data: TReviewItem[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  users: User[];
}

export const ProductApi = {
  async searchProducts(params: any) {
    try {
      const response = await ClientApi.axiosGet({
        data: {
          endpoint: '/api/product/client/get',
          params: params
        },
      });
      return response.data

    } catch (error) {
      console.error('🚀 ~ searchProducts ~ error:', error);
      return {
        data: [],
        pagination: { totalPages: 0, currentPage: 1, totalItems: 0 },
      };
    }
  },

  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await ClientApi.axiosGet({
        data: {
          endpoint: '/api/product/client/get',
          params: {
            page: 1,
            pageSize: 48,
          },
        },
      });
      if ('data' in response && response.data.success) {
        const products: Product[] = response.data.data || [];

        const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

        const sizes = Array.from(
          new Set(products.flatMap((p) => p.sizes || []).filter(Boolean))
        );

        const prices = products.map((p) => p.price).filter((p) => p != null);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 100000;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000;

        return {
          categories,
          sizes,
          minPrice,
          maxPrice,
        };
      }

      return {
        categories: [],
        sizes: [],
        minPrice: 100000,
        maxPrice: 10000000,
      };
    } catch (error) {
      console.error('getFilterOptions error:', error);
      return {
        categories: [],
        sizes: [],
        minPrice: 100000,
        maxPrice: 10000000,
      };
    }
  },

  async getProductDetail(id: string): Promise<Product> {
    try {
      const response = await ClientApi.axiosGet({
        data: {
          endpoint: `/api/product/client/${id}`,
          
        },
      });
      if(response.data.success){
        return response.data.data;
      }
      throw new Error('Product not found or API returned unsuccessful response');
    } catch (error) {
        console.error('Error fetching product detail:', error);
        throw error;
    }
  },

  async getReviewProduct(id: string, payload: any): Promise<ApiResponseGGetReviewProduct> {
    try {
      const response = await ClientApi.axiosGet({
        data: {
          endpoint: `/api/reviews/${id}`,
          params: payload
        },
      });
      if(response.data.success){
        return response.data;
      }
      throw new Error('Product not found or API returned unsuccessful response');
    } catch (error) {
        console.error('Error fetching product detail:', error);
        throw error;
    }
  },

  async createReviewProduct(payload: any): Promise<any> {
    try {
      const response = await ClientApi.axiosPost({
        data: {
          endpoint: `/api/reviews`,
          params: payload
        },
      });
      return response.data;
    } catch (error) {
        console.error('Error fetching product detail:', error);
        throw error;
    }
  },

  async updateReviewProduct(id: string, payload: any): Promise<any> {
    try {
      const response = await ClientApi.axiosPut({
        data: {
          endpoint: `/api/reviews/${id}`,
          params: payload
        },
      });
      console.log("🚀 ~ updateReviewProduct ~ response:", response)
      return response.data;
    } catch (error) {
        console.error('Error fetching product detail:', error);
        throw error;
    }
  },

  async deleteReviewProduct(id: string): Promise<any> {
    try {
      const response = await ClientApi.axiosDelete({
        data: {
          endpoint: `/api/reviews/${id}`,
        },
      });
      console.log("🚀 ~ deleteReviewProduct ~ response:", response)
      return response.data;
    } catch (error) {
      console.log("🚀 ~ deleteReviewProduct ~ error:", error)
      throw error;
    }
  },
};