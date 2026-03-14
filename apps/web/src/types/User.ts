export interface User {
  _id: string;
  userName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
  avatar: string;
  cart: string[]; 
  order: string[]; 
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
