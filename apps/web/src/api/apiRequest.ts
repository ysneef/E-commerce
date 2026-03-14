import axios from 'axios';

export interface AxiosRequestProps {
  data: {
    endpoint: string;
    headers?: any;
    params?: any;
    payload?: any;
    data?: any;
    isUserInfo?: boolean;
  };
}

export const ClientApi = {
  async axiosPost({ data }: AxiosRequestProps) {
    const API_URL = `${import.meta.env.VITE_BACKEND_API_ENDPOINT}${data.endpoint}`;
    const payload = {
      ...data.params,
    };

    try {
      const response = await axios
        .post(API_URL, payload, {
          headers: {
            ...(data.headers || {}),
          },
          withCredentials: true,
        })
      return response
    } catch (error) {
      console.error(error);
      return error?.response as any;
    }
  },

  async axiosGet({ data }: AxiosRequestProps) {
    const API_URL = `${import.meta.env.VITE_BACKEND_API_ENDPOINT}${data.endpoint}`;

    try {
      const response = await axios.get(API_URL, {
        headers: { ...(data.headers || {}) },
        params: data.params,
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error('GET request error:', error);
      return {} as any;
    }
  },

  async axiosPut({ data }: AxiosRequestProps) {
    const API_URL = `${import.meta.env.VITE_BACKEND_API_ENDPOINT}${data.endpoint}`;
    const payload = {
      ...data.params,
    };

    try {
      const response = await axios.put(API_URL, payload, {
        headers: { ...(data.headers || {}) },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error('PUT request error:', error);
      return {} as any;
    }
  },

  async axiosDelete({ data }: AxiosRequestProps) {
    const API_URL = `${import.meta.env.VITE_BACKEND_API_ENDPOINT}${data.endpoint}`;

    try {
      const response = await axios.delete(API_URL, {
        headers: { ...(data.headers || {}) },
        params: data.params,
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error('DELETE request error:', error);
      return {} as any;
    }
  },
};
