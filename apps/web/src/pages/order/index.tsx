import { formatNumber } from '@repo/ui';
import { Breadcrumb, Card, Descriptions, Divider, Spin, Table, Tag } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useAsyncRetry } from 'react-use';
import { orderApi } from '../../api/orderApi';
import { RootState } from '../../app/store';

const Orders = () => {
  const user = useSelector((state: RootState) => state.user);

  const { loading, value: orders, error, retry } = useAsyncRetry(async () => {
    if (!user?._id) return [];
    const res = await orderApi.getOrders(user._id);
    return res.data || [];
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spin tip="Loading orders..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-2">Error loading orders</p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto pt-20 pb-7">

      <div className="mb-5">
        <Breadcrumb
          separator=">"
          items={[
            { title: 'Home', href: '/' },
            { title: 'Orders' },
          ]}
        />
      </div>

      <h1 className="text-3xl font-bold mb-5">
        Your Orders
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-3">

          {orders?.map((order: any) => {

            const totalItems = order.items.reduce(
              (acc: number, item: any) => acc + item.quantity,
              0
            );

            const originalPrice = order.items.reduce(
              (acc: number, item: any) => acc + item.price * item.quantity,
              0
            );

            return (
              <Card
                key={order._id}
                title={`Order #${order._id.slice(-6).toUpperCase()}`}
                className="mb-6 shadow-md rounded-xl border border-gray-200"
              >

                <Descriptions column={2} bordered size="small">

                  <Descriptions.Item label="Order Date">
                    {moment(order.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>

                  <Descriptions.Item label="Subtotal">
                    <span className="font-semibold">
                      {formatNumber(originalPrice)} $
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Payment Method">
                    <Tag color="blue">{order.paymentMethod}</Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Discount">
                    <span className="text-red-600 font-semibold">
                      -{formatNumber(order.discount)} $
                    </span>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Total Items">
                    {totalItems}
                  </Descriptions.Item>

                  <Descriptions.Item label="Total">
                    <span className="text-green-600 font-semibold">
                      {formatNumber(order.totalPrice)} $
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Shipping Address">
                    <span className="text-sm text-gray-500">
                      {order.shippingAddress}
                    </span>
                  </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left" className="text-3xl font-bold mb-5 text-teal-600">
                  Product List
                </Divider>

                <Table
                  size="small"
                  bordered={false}
                  className="custom-order-table"
                  columns={[
                    {
                      title: 'Product',
                      key: 'product',
                      render: (_: any, record: any) => {

                        const image = record.image?.[0] || "/no-image.png";

                        return (
                          <div className="flex items-center gap-3">
                            <img
                              src={image}
                              alt={record.name}
                              className="w-14 h-14 object-cover rounded border"
                            />

                            <div className="flex flex-col">
                              <span className="font-medium">{record.name}</span>

                              {/* optional: show productId */}
                              <span className="text-xs text-gray-400">
                                ID: {record.productId || "N/A"}
                              </span>
                            </div>
                          </div>
                        );
                      },
                    },
                    {
                      title: 'Size',
                      dataIndex: 'size',
                      key: 'size',
                      align: 'center',
                      render: (size: string) => (
                        <Tag color="geekblue">{size}</Tag>
                      ),
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      align: 'center',
                      render: (q: number) => (
                        <span className="font-semibold">{q}</span>
                      ),
                    },
                    {
                      title: 'Price',
                      dataIndex: 'price',
                      key: 'price',
                      align: 'center',
                      render: (price: number) => (
                        <span className="text-gray-700">
                          {formatNumber(price)} $
                        </span>
                      ),
                    },
                    {
                      title: 'Discount',
                      dataIndex: 'discountPercent',
                      key: 'discountPercent',
                      align: 'center',
                      render: (percent: number) => (
                        percent ? (
                          <Tag color="red">-{percent}%</Tag>
                        ) : (
                          <span>-</span>
                        )
                      ),
                    },
                    {
                      title: 'Final Price',
                      dataIndex: 'discountPrice',
                      key: 'discountPrice',
                      align: 'center',
                      render: (_: number, record: any) => {

                        const finalPrice =
                          record.discountPrice ??
                          record.price - (record.price * (record.discountPercent ?? 0)) / 100;

                        return (
                          <span className="text-green-600 font-semibold">
                            {formatNumber(finalPrice)} $
                          </span>
                        );
                      },
                    },
                  ]}
                  dataSource={order.items.map((item: any) => ({
                    ...item,
                    key: item._id,
                  }))}
                  pagination={false}
                  rowKey="key"
                  rowClassName={(_, index) =>
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  }
                />


              </Card>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default Orders;
