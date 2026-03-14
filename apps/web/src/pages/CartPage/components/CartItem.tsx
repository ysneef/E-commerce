import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { TCartItem } from '../../../features/userSlice';
import { formatNumber } from '@repo/ui';

interface CartItemProps {
  item: TCartItem;
  increaseQuantity: (productId: string, size: string) => void;
  decreaseQuantity: (productId: string, size: string) => void;
  deleteItem: (productId: string, size: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
}) => {
  const displayPrice =
  item.discountPrice ??
  item.price - (item.price * (item.discountPercent ?? 0)) / 100;


  return (
    <div className="flex justify-between items-center p-5 gap-5 bg-transparent border-b h-full">
      <div className="flex items-center gap-5">
        <img
          src={item.image[0]}
          alt={item.name}
          className="w-32 h-32 object-cover rounded-lg bg-[#F0EEED] p-3"
        />
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
            <p className="text-gray-600">Size: {item.size}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {/* Giá sau discount */}
            <span className="text-lg font-bold text-red-600">
              {formatNumber(displayPrice * item.quantity)} $
            </span>

            {/* Giá gốc */}
            {item.discountPercent > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatNumber(item.price * item.quantity)} $
              </span>
            )}

            {/* Badge discount */}
            {item.discountPercent > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{item.discountPercent}%
              </span>
            )}
          </div>

        </div>
      </div>

      <div className="flex flex-col justify-between h-full items-end gap-3">
        <button
          className="text-red-500 hover:text-red-600 text-xl"
          onClick={() => deleteItem(item.productId, item.size)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-300">
          <button
            onClick={() => decreaseQuantity(item.productId, item.size)}
            className="w-8 h-8 flex items-center justify-center text-2xl font-bold hover:text-black disabled:opacity-40"
          >
            -
          </button>
          <span className="font-semibold">{item.quantity}</span>
          <button
            onClick={() => increaseQuantity(item.productId, item.size)}
            className="w-8 h-8 flex items-center justify-center text-2xl font-bold hover:text-black"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
