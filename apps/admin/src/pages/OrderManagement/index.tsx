import { EyeOutlined } from "@ant-design/icons"
import { formatNumber } from "@repo/ui"
import { Avatar, Button, notification, Select, Table, Tooltip } from "antd"
import { get } from "lodash"
import moment from "moment"
import { useState } from "react"
import { useAsyncRetry } from "react-use"
import { InfoList } from "../../components/InfoList"
import OrderApi from "./api/order.api"
import DrawerProductDetail from "./components/drawer/DrawerProductDetail"
import FilterUser from "./components/Filter"
import { TOrder, User } from "./models/Product.model"


const { Option } = Select;
const initPayload = {
  page: 1,
  pageSize: 5,
  sortBy: "createdAt",
  sortOrder: "desc",
}

const OrderManagement = () => {
  const [_, contextHolder] = notification.useNotification();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | any>(null);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await OrderApi.updateOrder(id, { status: newStatus });
      notification.success({ message: "Update status successfully" });
      retry();
    } catch (error: any) {
      notification.error({ message: error.message || "Failed to update status" });
    }
  };

  const [productDrawerVisible, setProductDrawerVisible] = useState(false);

  const handleOpenProductDrawer = (order: TOrder) => {
    const productDetails = order.items.map((item) => {
      const productInfo = get(value, ['moreInfo', 'products', item._id], null);
      return productInfo ? { ...item, ...productInfo } : item;
    });
    setSelectedOrder({ ...order, items: productDetails });

    setProductDrawerVisible(true);
  };

  const handleCloseProductDrawer = () => {
    setProductDrawerVisible(false);
    setSelectedOrder([]);
    // setSelectedProducts([]);
  };

  const [criteria, setCriteria] = useState({
    loading: false,
    payload: initPayload,
  })

  const { value, error, loading, retry } = useAsyncRetry(
    () => OrderApi.getOrder(criteria.payload),
    [criteria]
  )


  console.log("🚀 ~ OrderManagement ~ value:", value)

  const handleSearch = (values: any) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        ...values,
        page: 1,
      },
    }))
  }

  const handleSortByChange = (value: string) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        sortBy: value,
      },
    }))
  }

  const handleSortOrderChange = (value: string) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        sortOrder: value,
      },
    }))
  }

  const handleTableChange = (pagination: any) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    }));
  };

  if (error) (
    <div className="text-center text-xl text-red-500">
      Error: {error.message}
    </div>
  )

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      width: 160,
      ellipsis: true,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 250,
      render: (user: User) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar src={user?.avatar} size={40} />
            <div>
              <div style={{ fontWeight: 500 }}>{user?.userName}</div>
              <small style={{ color: "#666" }}>{user?.email}</small>
            </div>
          </div>
        )
      }
    },
    {
      title: "Phone Number",
      dataIndex: "user",
      key: "user",
      width: 120,
      render: (user: User) => (
        <div>{user.phone || "No data"}</div>
      )
    },
    {
      title: "Products",
      dataIndex: "items",
      key: "items",
      width: 130,
      render: (_: any, record: TOrder) => (
        <Button type="link" onClick={() => handleOpenProductDrawer(record)}>
          View Details
        </Button>
      )
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 140,
      render: (price: number) => (
        <div>{formatNumber(price)} $ </div>
      )
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: 120,
      render: (discount: number) => (
        <div>{formatNumber(discount)} $ </div>
      )
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      width: 280,
      ellipsis: true,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 130,
      render: (method: string) => {
        const methodMap = {
          'Credit Card': "Credit Card",
          paypal: "PayPal",
          cash: "Cash",
        };
        return methodMap[method as keyof typeof methodMap] || "Cash on Delivery (COD)";
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={moment(text).format("DD/MM/YYYY HH:mm:ss")}>{moment(text).format("DD/MM/YYYY HH:mm:ss")}</Tooltip>
      )
    },
    {
      title: "Status",
      key: "status",
      fixed: "right" as const,
      width: 140,
      align: "center" as any,
      render: (_: any, record: TOrder) => (
        <Select
          defaultValue={record.status || "pending"}
          style={{ width: 120 }}
          onChange={(val) => handleUpdateStatus(record._id, val)}
          options={[
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      ),
    },
  ];


  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Order List
      </h2>
      <FilterUser
        loading={loading}
        criteria={criteria.payload}
        visible={true}
        onSearch={handleSearch}
      />
      <InfoList
        right={
          <div className="flex gap-2">
            <Select
              defaultValue={criteria.payload.sortBy}
              style={{ width: 180 }}
              onChange={handleSortByChange}
            >
              <Option value="name">Product Name</Option>
              <Option value="price">Price</Option>
              <Option value="discountPercent">Discount</Option>
              <Option value="rating">Rating</Option>
              <Option value="createdAt">Created Date</Option>

            </Select>

            <Select
              defaultValue={criteria.payload.sortOrder}
              style={{ width: 120 }}
              onChange={handleSortOrderChange}
            >
              <Option value="asc">Ascending</Option>
              <Option value="desc">Descending</Option>

            </Select>
          </div>
        }
        list={value?.data ? value?.data?.length : 0}
        refresh={retry}
      />
      <Table
        loading={loading}
        dataSource={value?.data}
        columns={columns}
        rowKey="_id"
        // pagination={false}
        style={{ marginTop: 10 }}
        scroll={{ x: 'calc(1100px + 50%)' }}
        pagination={{
          current: criteria.payload.page,
          pageSize: criteria.payload.pageSize,
          total: value?.totalItems || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
      />
      {contextHolder}
      <DrawerProductDetail visible={productDrawerVisible} onClose={handleCloseProductDrawer} products={selectedOrder?.items} />

    </div>
  )
}

export default OrderManagement
