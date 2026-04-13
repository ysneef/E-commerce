export type Product = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  brand: string;
  rating: number;

  sizes: {
    size: string;
    quantity: number;
  }[];

  category: {
    id: string;
    name: string;
  };

  flashSaleInfo?: {
    price: number;
    endTime: string;
    saleName: string;
  };

  image: string[];

  createdAt: string;
  updatedAt: string;
};
