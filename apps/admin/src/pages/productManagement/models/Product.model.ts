export type TProduct = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  discountPrice: number;
  brand: string;
  rating: number;

  category: {
    id: string;
    name: string;
  };

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
