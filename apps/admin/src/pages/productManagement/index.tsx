import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  notification,
  Popover,
  Rate,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { ReactNode, useState } from "react";
import { useAsyncRetry } from "react-use";
import { InfoList } from "../../components/InfoList";
import { capitalizeFirstLetter } from "../../Utils/Funtions";
import ProductApi from "./api/product.api";
import DrawerAddUpdateProductForm from "./components/drawer/DrawerAddUpdateProductForm";
import FilterProduct from "./components/Filter";
import ProductImageModal from "./components/ProductImageModal";
import { TProduct } from "./models/Product.model";
import { formatNumber } from "@repo/ui";

const { Option } = Select;

const initPayload = {
  page: 1,
  pageSize: 5,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const ProductManagement = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loadingAction, setLoadingAction] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | any>(null);

  const [criteria, setCriteria] = useState({
    loading: false,
    payload: initPayload,
  });

  const { value, error, loading, retry } = useAsyncRetry(
    () => ProductApi.getProduct(criteria.payload),
    [criteria]
  );

  const handleSearch = (values: any) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        ...values,
        page: 1,
      },
    }));
  };

  const handleSortByChange = (value: string) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        sortBy: value,
      },
    }));
  };

  const handleSortOrderChange = (value: string) => {
    setCriteria((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        sortOrder: value,
      },
    }));
  };

  const handleDelete = async (record: any) => {
    setLoadingAction(true);
    const response = await ProductApi.deleteProduct(record._id);

    if (response.success) {
      api.success({
        message: "Success",
        description: "Product deleted successfully!",
      });
    } else {
      api.error({
        message: "Failed",
        description: "Failed to delete product!",
      });
    }

    retry();
    setLoadingAction(false);
  };

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (error)
    return (
      <div className="text-center text-xl text-red-500">
        Error: {error.message}
      </div>
    );

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      fixed: "left" as any,
      render: (_: any, __: any, index: number) => {
        const { page = 1, pageSize = 10 } = criteria.payload || {};
        return (page - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: 180,
      fixed: "left" as any,
      ellipsis: true,
      render: (name: any) => <Tooltip title={name}>{name}</Tooltip>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center" as any,
      render: (status: string) => {
        const statusMap: { [key: string]: { icon: ReactNode } } = {
          true: {
            icon: (
              <CheckCircleOutlined
                style={{ color: "green", fontSize: "18px" }}
              />
            ),
          },
          false: {
            icon: (
              <CloseCircleOutlined style={{ color: "red", fontSize: "18px" }} />
            ),
          },
        };

        return (
          statusMap[status]?.icon || (
            <QuestionCircleOutlined
              style={{ color: "gray", fontSize: "18px" }}
            />
          )
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: true,
      render: (description: any) => (
        <Popover content={description} title="Description">
          {description}
        </Popover>
      ),
    },
    {
      title: "Sizes",
      dataIndex: "sizes",
      key: "sizes",
      width: 130,
      render: (sizes: string[]) =>
        sizes && sizes.length > 0 ? (
          <div className="flex flex-wrap gap-y-1">
            {sizes.map((size) => (
              <Tag key={size} color="blue">
                {size}
              </Tag>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Images",
      dataIndex: "image",
      key: "image",
      width: 100,
      align: "center" as any,
      render: (image: string[], record: TProduct) => (
        <div>
          {image.length > 0 && (
            <EyeOutlined
              style={{
                fontSize: 20,
                cursor: "pointer",
                color: "#8e00e8",
              }}
              onClick={() => {
                setSelectedProduct(record);
                setIsModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
    {
      title: "Original Price",
      dataIndex: "price",
      key: "price",
      width: 130,
      render: (price: number) => <div>{formatNumber(price)} USD</div>,
    },
    {
      title: "Discount (%)",
      dataIndex: "discountPercent",
      key: "discountPercent",
      align: "center" as any,
      width: 120,
    },
    {
      title: "Discount Price",
      dataIndex: "discountPrice",
      key: "discountPrice",
      width: 150,
      render: (discountPrice: number) => (
        <div>{formatNumber(discountPrice)} USD</div>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: 120,
      render: (text: string) => text.toUpperCase(),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string) => capitalizeFirstLetter(category),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (rating: number) => (
        <Popover content={<Rate allowHalf defaultValue={rating} />} title="Rating">
          {rating}
        </Popover>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (text: string) => (
        <Tooltip title={moment(text).format("DD/MM/YYYY HH:mm:ss")}>
          {moment(text).format("DD/MM/YYYY HH:mm:ss")}
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            loading={loadingAction}
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const [visibleDrawerUpdateAdd, setVisibleDrawerUpdateAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setVisibleDrawerUpdateAdd(true);
  };

  const handleEdit = (product: TProduct) => {
    setEditingProduct(product);
    setVisibleDrawerUpdateAdd(true);
  };

  const handleClose = () => {
    setVisibleDrawerUpdateAdd(false);
  };

  const handleSubmit = async (values: TProduct) => {
    const isUpdate = Boolean(values._id);

    const response = isUpdate
      ? await ProductApi.updateProduct(values._id || "", values)
      : await ProductApi.createProduct(values);

    if (response.success) {
      api.success({
        message: "Success",
        description: `${isUpdate ? "Updated" : "Added"} product successfully!`,
      });

      retry();
      setVisibleDrawerUpdateAdd(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Product List
      </h2>

      <div className="flex justify-between items-center">
        <FilterProduct
          loading={loading}
          criteria={criteria.payload}
          visible={true}
          onSearch={handleSearch}
        />

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Product
        </Button>
      </div>

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
        style={{ marginTop: 10 }}
        scroll={{ x: "calc(1100px + 50%)" }}
        pagination={{
          current: criteria.payload.page,
          pageSize: criteria.payload.pageSize,
          total: value?.totalItems || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
      />

      <DrawerAddUpdateProductForm
        open={visibleDrawerUpdateAdd}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={editingProduct}
      />

      <ProductImageModal
        visible={isModalOpen}
        images={selectedProduct?.image}
        onClose={() => setIsModalOpen(false)}
      />

      {contextHolder}
    </div>
  );
};

export default ProductManagement;
