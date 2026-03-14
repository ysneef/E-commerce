import axios from "axios";

const API_BASE_URL = "https://e-commerce-api-red.vercel.app/"

export interface AxiosRequestProps {
  data: {
    endpoint: string;
    headers?: any;
    params?: any;
    body?: any;
  };
}

const getToken = () => localStorage.getItem("token");

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_ENDPOINT,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const AdminApi = {

  axiosGet: async ({ data }: AxiosRequestProps) => {
    try {
      const res = await instance.get(data.endpoint, {
        params: data.params,
        headers: data.headers,
      });

      return res;
    } catch (error: any) {
      console.error("GET error:", error);
      return error?.response;
    }
  },

  axiosPost: async ({ data }: AxiosRequestProps) => {
    try {
      const res = await instance.post(
        data.endpoint,
        data.body || data.params,
        { headers: data.headers }
      );

      return res;
    } catch (error: any) {
      console.error("POST error:", error);
      return error?.response;
    }
  },

  axiosPut: async ({ data }: AxiosRequestProps) => {
    try {
      const res = await instance.put(
        data.endpoint,
        data.body || data.params,
        { headers: data.headers }
      );

      return res;
    } catch (error: any) {
      console.error("PUT error:", error);
      return error?.response;
    }
  },

  axiosDelete: async ({ data }: AxiosRequestProps) => {
    try {
      const res = await instance.delete(data.endpoint, {
        params: data.params,
        headers: data.headers,
      });

      return res;
    } catch (error: any) {
      console.error("DELETE error:", error);
      return error?.response;
    }
  },
};
