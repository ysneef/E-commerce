import { Breadcrumb } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClientProductApi from '../../api/ClientProductApi';
import { RootState } from '../../app/store';
import { setUser, UserState } from '../../features/userSlice';
import CartItemsList from './components/CartItemsList';
import OrderSummary from './components/OrderSummary';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const increaseQuantity = async (productId: string, size: string) => {
    try {
      const item = user?.cart?.find(
        (item) => item.productId === productId && item.size === size
      );

      if (!item) return;

      const param = {
        productId,
        name: item.name,
        quantity: item.quantity + 1,
        image: item.image,
        price: item.price,
        discountPercent: item.discountPercent,
        action: 'update' as const,
        size
      };

      const response = await ClientProductApi.manageCart(param);

      if (response.success) {
        dispatch(
          setUser({
            cart: response.cart,
            totalCart: response.totalCart
          } as UserState)
        );
      } else {
        setError(response.message || 'Unable to increase quantity');
      }
    } catch {
      setError('Unable to increase quantity');
    }
  };

  const decreaseQuantity = async (productId: string, size: string) => {
    try {
      const item = user?.cart?.find(
        (item) => item.productId === productId && item.size === size
      );

      if (!item) return;

      if (item.quantity <= 1) {
        await deleteItem(productId, size);
        return;
      }

      const param = {
        productId,
        name: item.name,
        quantity: item.quantity - 1,
        image: item.image,
        price: item.price,
        discountPercent: item.discountPercent,
        action: 'update' as const,
        size
      };

      const response = await ClientProductApi.manageCart(param);

      if (response.success) {
        dispatch(
          setUser({
            cart: response.cart,
            totalCart: response.totalCart
          } as UserState)
        );
      } else {
        setError(response.message || 'Unable to decrease quantity');
      }
    } catch {
      setError('Unable to decrease quantity');
    }
  };

  const deleteItem = async (productId: string, size: string) => {
    try {
      const param = {
        productId,
        action: 'delete' as const,
        size
      };

      const response = await ClientProductApi.manageCart(param);

      if (response.success) {
        dispatch(
          setUser({
            cart: response.cart,
            totalCart: response.totalCart
          } as UserState)
        );
      } else {
        setError(response.message || 'Unable to remove item');
      }
    } catch {
      setError('Unable to remove item');
    }
  };

  if (!user?.cart) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (user?.cart?.length === 0) {
  return (
    <div className="max-w-screen-xl mx-auto pt-32 text-center">
      <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
      <Link to="/category" className="text-black-500">
        Continue shopping
      </Link>
    </div>
  );
}


  return (
    <div className="max-w-screen-xl mx-auto pt-20 pb-10">
      <div className="my-5">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: 'Home',
              href: '/',
            },
            {
              title: 'Cart',
            },
          ]}
        />
      </div>

      <h1 className="text-3xl font-bold mb-5">Your Cart</h1>

      <div className="flex gap-5 w-full">
        <CartItemsList
          cartItems={user?.cart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          deleteItem={deleteItem}
        />

        <OrderSummary cartItems={user?.cart} />
      </div>
    </div>
  );
};

export default CartPage;
