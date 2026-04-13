import { RegisterFormValues } from '../components/Auth/Register';
import { ClientApi } from './apiRequest';

export type LoginFormValues = {
  userName: string
  password: string
}

export const UserApi = {
  async getInfo() {
    try {
      const response = await ClientApi.axiosGet({
        data: {
          endpoint: "/api/users/me",
        },
      });
      return response.data

    } catch (error) {
      return {};
    }
  },

  async login(payload: LoginFormValues) {
    try {
      const response = await ClientApi.axiosPost({
        data: {
          endpoint: "/api/users/login",
          params: payload,
        },
      });
      return response.data

    } catch (error: any) {
      return error?.data || { success: false, message: "An error occurred during login." };
    }
  },

  async register(payload: RegisterFormValues) {
    try {
      const response = await ClientApi.axiosPost({
        data: {
          endpoint: '/api/users/register',
          params: {
            ...payload,
          },
        },
      });
      return response.data

    } catch (error) {
      return {};
    }
  },

  async updateUser(id: string, payload: object): Promise<any> {
    try {
      const response = await ClientApi.axiosPut({
        data: {
          endpoint: `/api/users/${id}`,
          params: payload,
        },
      });
      console.log("response:", response);
      return response.data;
    } catch (error) {
      return error;
    }
  },

  async forgotPassword(email: string) {
    try {
      const response = await ClientApi.axiosPost({
        data: {
          endpoint: '/api/users/forgot-password',
          params: { email },
        },
      });
      return response.data;
    } catch (error) {
      return { success: false, message: 'Lỗi Call API' };
    }
  },

  async resetPassword(payload: any) {
    try {
      const response = await ClientApi.axiosPost({
        data: {
          endpoint: '/api/users/reset-password',
          params: payload,
        },
      });
      return response.data;
    } catch (error) {
      return { success: false, message: 'Lỗi Call API' };
    }
  },
};