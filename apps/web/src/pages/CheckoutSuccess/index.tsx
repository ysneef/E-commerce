import { Button, Result, Spin, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderApi, OrderPayload } from '../../api/orderApi';
import { UserApi } from '../../api/userApi';
import { RootState } from '../../app/store';
import { setUser } from '../../features/userSlice';
import _ from 'lodash';

const CheckoutSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [api, contextHolder] = notification.useNotification();
    const apiBase = (import.meta.env.VITE_BACKEND_API_ENDPOINT || "").replace(/\/$/, "");

    useEffect(() => {
        // Wait for Redux user state to hydrate before trying to create an order
        if (!user?._id) return;

        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');
            const shippingAddress = searchParams.get('shipping');

            if (!sessionId) {
                setStatus('error');
                setMessage('Invalid session ID.');
                return;
            }

            try {
                if (!apiBase) {
                    setStatus('error');
                    setMessage('Payment verification is unavailable. Please contact support or use Cash on Delivery.');
                    return;
                }

                // Verify session payment status
                const verifyRes = await fetch(`${apiBase}/api/stripe/verify-session?session_id=${sessionId}`);
                const verifyData = await verifyRes.json();

                if (!verifyData.success || verifyData.session?.payment_status !== 'paid') {
                    setStatus('error');
                    setMessage('Payment verification failed or payment not completed.');
                    return;
                }

                // If paid, create order
                if (!user?.cart?.length) {
                    // It's possible the order was already created, or cart is empty
                    setStatus('success');
                    setMessage('Your payment was successful!');
                    return;
                }

                const payload: OrderPayload = {
                    userId: user._id,
                    items: user.cart.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        size: item.size
                    })),
                    shippingAddress: shippingAddress || 'N/A',
                    paymentMethod: 'Credit Card',
                };

                const orderRes = await orderApi.createOrder(payload);

                if (!orderRes.success) {
                    throw new Error(orderRes.message || 'Failed to create order in database.');
                }

                // Clean up cart
                const userInfo = await UserApi.getInfo();
                if (!_.isEmpty(userInfo)) {
                    dispatch(setUser(userInfo));
                }

                setStatus('success');
                setMessage('Your order has been placed successfully!');

                setTimeout(() => {
                    navigate('/orders');
                }, 3000);

            } catch (err: any) {
                console.error(err);
                setStatus('error');
                setMessage(err.message || 'An error occurred during verification.');
                api.error({ message: 'Error', description: err.message });
            }
        };

        if (status === 'loading') {
             verifyPayment();
        }
    }, [searchParams, user?._id, dispatch, navigate, api]);

    return (
        <div className="flex justify-center items-center h-screen">
            {contextHolder}
            {status === 'loading' && <Spin size="large" tip="Verifying payment..." />}
            
            {status === 'success' && (
                <Result
                    status="success"
                    title="Payment Successful!"
                    subTitle={message}
                    extra={[
                        <Button type="primary" key="orders" onClick={() => navigate('/orders')}>
                            View Orders
                        </Button>,
                        <Button key="home" onClick={() => navigate('/')}>
                            Back Home
                        </Button>,
                    ]}
                />
            )}

            {status === 'error' && (
                <Result
                    status="error"
                    title="Payment Failed"
                    subTitle={message}
                    extra={[
                        <Button type="primary" key="cart" onClick={() => navigate('/cart')}>
                            Return to Cart
                        </Button>,
                    ]}
                />
            )}
        </div>
    );
};

export default CheckoutSuccess;
