import { formatNumber } from '@repo/ui';
import { Button, Input, Modal, notification, Select } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderApi, OrderPayload } from '../../../api/orderApi';
import { RootState } from '../../../app/store';
import { setUser, TCartItem } from '../../../features/userSlice';
import { UserApi } from '../../../api/userApi';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface OrderSummaryProps {
  cartItems: TCartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems = [] }) => {

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const apiBase = (import.meta.env.VITE_BACKEND_API_ENDPOINT || "").replace(/\/$/, "");

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // ===== Calculate =====
  const subtotal = safeCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = safeCartItems.reduce((sum, item) => {
    const discountPrice =
      item.discountPrice ??
      item.price - (item.price * (item.discountPercent ?? 0)) / 100;

    return sum + (item.price - discountPrice) * item.quantity;
  }, 0);

  const total = subtotal - discount;

  // ===== Check stock =====
  const hasOutOfStock = safeCartItems.some(
    (item) => item.stock !== undefined && item.quantity > item.stock
  );

  const handleOrder = async () => {

    if (!shippingAddress || !paymentMethod) {
      return api.warning({
        message: 'Missing information',
        description: 'Please enter the shipping address and select a payment method.',
      });
    }

    if (!safeCartItems.length) {
      return api.warning({
        message: "Cart empty",
        description: "Your cart is empty.",
      });
    }

    const outOfStockItem = safeCartItems.find(
      (item) => item.stock !== undefined && item.quantity > item.stock
    );

    if (outOfStockItem) {
      return api.error({
        message: "Out of stock",
        description: `${outOfStockItem.name} exceeds available stock`,
      });
    }

    try {
      if (paymentMethod === "Credit Card") {
        if (!apiBase) {
          return api.error({
            message: "Payment unavailable",
            description: "Payment is not configured. Please choose Cash on Delivery.",
          });
        }

        // Intercept for Stripe Checkout
        const items = safeCartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size
        }));

        const res = await fetch(`${apiBase}/api/stripe/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items, shippingAddress })
        });
        
        const data = await res.json();
        
        if (data.success && data.url) {
            window.location.href = data.url; 
        } else {
            api.error({ message: "Stripe error", description: data.message });
        }
        return;
      }

      const payload: OrderPayload = {
        userId: user._id,
        items: safeCartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size
        })),
        shippingAddress,
        paymentMethod,
      };

      const response = await orderApi.createOrder(payload);

      if (!response?.success) {
        return api.error({
          message: "Order failed",
          description: response?.message || "Something went wrong",
        });
      }

      api.success({
        message: 'Success',
        description: 'Order placed successfully!',
      });

      setIsModalVisible(false);

      // Refresh user (clear cart)
      const userInfo = await UserApi.getInfo();
      if (!_.isEmpty(userInfo)) {
        dispatch(setUser(userInfo));
      }

      navigate("/orders");

    } catch (error: any) {
      api.error({
        message: "Order failed",
        description: error.message || "Server error",
      });
    }
  };

  return (
    <div className="w-[35%] min-h-[300px] h-full p-5 border-2 border-gray-200 rounded-lg flex flex-col justify-between">

      {contextHolder}

      <h2 className="text-2xl mb-5">Order Summary</h2>

      {/* Stock warning */}
      {hasOutOfStock && (
        <div className="text-red-500 text-sm mb-3">
          Some items exceed available stock. Please adjust quantity.
        </div>
      )}

      <div className="flex justify-between mb-2">
        <span>SubTotal</span>
        <span>{formatNumber(subtotal)} $</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Discount</span>
        <span className="text-red-500">-{formatNumber(discount)} $</span>
      </div>

      <div className="flex justify-between border-t border-gray-200 pt-2">
        <span>Total</span>
        <span className="text-lg font-bold">{formatNumber(total)} $</span>
      </div>

      <Button
        className="w-full py-6 bg-black text-white rounded-full cursor-pointer text-base"
        disabled={!user.cart || user.cart.length === 0 || hasOutOfStock}
        onClick={() => setIsModalVisible(true)}
        >
        Go to Checkout → 
      </Button>

      <Modal
        title="Order Information"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOrder}
        okText="Confirm Order"
        cancelText="Cancel"
        destroyOnClose
      >
        <div className="flex flex-col gap-4 mt-2">

          <Input
            placeholder="Enter shipping address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />

          <Select
            placeholder="Select payment method"
            value={paymentMethod}
            onChange={(value) => setPaymentMethod(value)}
          >
            <Option value="COD">Cash on Delivery (COD)</Option>
            <Option value="Credit Card">Credit Card</Option>
          </Select>

        </div>
      </Modal>

    </div>
  );
};

export default OrderSummary;
