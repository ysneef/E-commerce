import { AdminApi } from "../../../api/apiRequest"
import { AddUserValues } from "../components/drawer/AddUser"

const UserApi = {
  getUser: async (payload: any): Promise<any> => {
    console.log("🚀 ~ getUser: ~ payload:", payload)
    try {
      const response = await AdminApi.axiosGet({
        data: {
          endpoint: "/api/users/get",
          params: payload,
        },
      })

      return response.data
    } catch (error) {
      return error;
    }
  },
  createUser: async (payload: AddUserValues): Promise<any> => {
    try {
      const response = await AdminApi.axiosPost({
        data: {
          endpoint: "/api/users/register",
          params: payload,
        },
      });

      return response.data;
    } catch (error) {
      return error;
    }
  },

  updateUser: async (id: string, payload: object): Promise<any> => {
    try {
      const response = await AdminApi.axiosPut({
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

  deleteUser: async (id: string): Promise<any> => {
    try {
      const response = await AdminApi.axiosDelete({
        data: {
          endpoint: `/api/users/${id}`,
        },
      });

      return response.data;
    } catch (error:any) {
      return {
        success: false,
        message: error.message
      };
    }
  },


  logoutUser: async (): Promise<any> => {
    try {
      const response = await AdminApi.axiosPost({
        data: {
          endpoint: "/api/users/logout",
          params: {},
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },

}

export default UserApi
