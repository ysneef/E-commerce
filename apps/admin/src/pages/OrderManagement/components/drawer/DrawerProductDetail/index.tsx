import { Descriptions, Divider, Drawer, Steps, Table, Tag, Typography } from "antd";
import { TOrder } from "../../../models/Product.model";
import moment from "moment";
import { formatNumber } from "@repo/ui";

const { Title, Text } = Typography;

interface DrawerProductDetailProps {
  visible: boolean;
  onClose: () => void;
  order: TOrder | null;
}

const statusSteps = ["pending", "processing", "shipped", "delivered"];

const DrawerProductDetail: React.FC<DrawerProductDetailProps> = ({ visible, onClose, order }) => {
  if (!order) return null;

  const currentStatusIndex = statusSteps.indexOf(order.status || "pending");

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div>
          <div className="font-semibold text-gray-800">{text}</div>
          <Tag color="blue">Size: {record.size}</Tag>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      render: (q: number) => <span className="font-medium">{q}</span>,
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      align: "right" as const,
      render: (p: number) => <span>{formatNumber(p)} $</span>,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "right" as const,
      render: (p: number) => <span className="font-bold text-blue-600">{formatNumber(p)} $</span>,
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <span>Order Details</span>
          <Text type="secondary" className="text-sm font-normal">#{order._id}</Text>
        </div>
      }
      width={1000}
      open={visible}
      onClose={onClose}
      maskClosable={true}
      bodyStyle={{ padding: "24px" }}
    >
      <div className="space-y-8">
        {/* Order Status Steps */}
        <section className="py-4">
          <Steps
            current={currentStatusIndex}
            items={[
              { title: "Pending" },
              { title: "Processing" },
              { title: "Shipped" },
              { title: "Delivered" },
            ]}
          />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer & Shipping Info */}
          <section>
            <Title level={5} className="mb-4">Customer Information</Title>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Customer Name">{order.user?.userName}</Descriptions.Item>
              <Descriptions.Item label="Email">{order.user?.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{order.user?.phone || "N/A"}</Descriptions.Item>
            </Descriptions>
          </section>

          <section>
            <Title level={5} className="mb-4">Delivery & Payment</Title>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Shipping Address">
                <Text className="w-full break-words">{order.shippingAddress}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                <Tag color="cyan">{order.paymentMethod || "COD"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {moment(order.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
            </Descriptions>
          </section>
        </div>

        <Divider />

        {/* Product Items Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <Title level={5} className="m-0 uppercase tracking-wider text-xs font-bold text-gray-500">Order Items</Title>
            <Tag color="default">{order.items.length} Items</Tag>
          </div>
          <Table
            dataSource={order.items}
            columns={columns}
            rowKey={(record, index) => `${record._id}-${index}`}
            pagination={false}
            className="modern-table"
            bordered={false}
          />
        </section>

        {/* Order Summary */}
        <section className="flex justify-end pt-6">
          <div className="w-full max-w-xs space-y-4">
            <div className="flex justify-between items-center px-2">
              <Text className="text-gray-500">Subtotal</Text>
              <Text className="font-medium">{formatNumber(order.totalPrice + (order.discount || 0))} $</Text>
            </div>
            <div className="flex justify-between items-center px-2">
              <Text className="text-gray-500">Discount</Text>
              <Text className="font-medium text-red-500">-{formatNumber(order.discount || 0)} $</Text>
            </div>
            <Divider className="my-2 border-gray-100" />
            <div className="flex justify-between items-center px-2 py-1">
              <Title level={4} className="m-0 text-gray-800 font-bold uppercase tracking-tight text-lg">Total Amount</Title>
              <Title level={4} className="m-0 text-blue-600 font-black text-xl">{formatNumber(order.totalPrice)} $</Title>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
};

export default DrawerProductDetail;
