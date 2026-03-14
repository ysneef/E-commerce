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
  createdAt: string;
  updatedAt: string;
  image: string[]
  status?: boolean
};
