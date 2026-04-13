export type TProduct = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  rating: number;

  category: string;

  image: string[];

  sizes: TProductSize[];

  status?: boolean;

  createdAt: string;
  updatedAt: string;
};


export type TProductSize = {
  size: string;
  quantity: number;
};
