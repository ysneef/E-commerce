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
  const [api, contextHolder] = notification.useNotification();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  const discount = safeCartItems.reduce((sum, item) => {
    const discountPrice =
      item.discountPrice ??
      item.price - (item.price * (item.discountPercent ?? 0)) / 100;

    const discountPerItem = item.price - discountPrice;

    return sum + discountPerItem * item.quantity;
  }, 0);



  // const deliveryFee = subtotal > 0 ? 15 : 0;
  // const total = subtotal - discount + deliveryFee;
  const total = subtotal - discount;

  const handleOrder = async () => {
    if (!shippingAddress || !paymentMethod) {
      return api.warning({
        message: 'Missing information',
        description: 'Please enter the shipping address and select a payment method.',
      });
    }

    try {
      const payload = {
        userId: user._id,
        items: user.cart,
        shippingAddress,
        paymentMethod,
      };

      const response = await orderApi.createOrder(payload as OrderPayload);

      if (response.success) {
        
        api.success({
          message: 'Success',
          description: 'Order placed successfully!',
        });
        setIsModalVisible(false);
        const userInfo = await UserApi.getInfo()
        if(!_.isEmpty(userInfo)){
          dispatch(setUser(userInfo))
        }
        navigate("/orders")
      }
    } catch (error) {
      console.error('Order failed', error);
      api.error({
        message: 'Đặt hàng thất bại',
        description: 'An error occurred while placing the order.',
      });
    }
  };

  return (
    <div className="w-[35%] min-h-[300px] h-full p-5 border-2 border-gray-200 rounded-lg flex flex-col justify-between">
      <h2 className="text-2xl mb-5">Order Summary</h2>
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
        disabled={user.cart?.length === 0}
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
      {contextHolder}
    </div>
  );
};

export default OrderSummary;
