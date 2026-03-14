import React from 'react';
import CartItem from './CartItem';
import { TCartItem } from '../../../features/userSlice';

interface CartItemsListProps {
  cartItems: TCartItem[];
  increaseQuantity: (id: string, size: string) => void;
  decreaseQuantity: (id: string, size: string) => void;
  deleteItem: (productId: string, size: string) => void;
}

const CartItemsList: React.FC<CartItemsListProps> = ({
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
}) => {
  console.log("cartItems:", cartItems);
  return (
    <div className="flex flex-col gap-5 flex-1 p-5 min-h-0 border-2 border-gray-200 rounded-[10px]">
      {cartItems.map((item, index) => (
        <div
          key={index}
          className={index !== cartItems.length - 1 ? 'pb-[30px] border-b border-gray-200' : ''}
        >
          <CartItem
            item={item}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            deleteItem={deleteItem}
          />
        </div>
      ))}
    </div>
  );
};

export default CartItemsList;
