import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  _id: string;
  userName: string;
  avatar: string;
  email: string;
  address: string;
  phone: string;
  order: any[];
  cart: any[];
  role: string;
  createdAt: string;
  updatedAt: string;
}

const initialState: UserState = {
  _id: "",
  userName: "",
  avatar: "",
  email: "",
  address: "",
  phone: "",
  order: [],
  cart: [],
  role: "",
  createdAt: "",
  updatedAt: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
