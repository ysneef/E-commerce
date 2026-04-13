import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useAsyncRetry } from "react-use";
import { flashSaleApi } from "../../api/flashSaleApi";
import ProductApi from "../productManagement/api/product.api";

const { RangePicker } = DatePicker;

const FlashSaleManagement = () => {
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [form] = Form.useForm();

  // Fetch flash sales
  const { value: sales, loading, retry } = useAsyncRetry(
    () => flashSaleApi.getFlashSales(),
    []
  );

  // Fetch products for selection
  const { value: productData } = useAsyncRetry(
    () => ProductApi.getProduct({ page: 1, pageSize: 100 }),
    []
  );
  const products = productData?.data || [];

  const handleAdd = () => {
    setEditingSale(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingSale(record);
    form.setFieldsValue({
      name: record.name,
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime),
      status: record.status,
      products: record.products.map((p: any) => ({
        productId: p.productId,
        flashSalePercent: p.flashSalePercent,
        stockLimit: p.stockLimit,
      })),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await flashSaleApi.deleteFlashSale(id);
      api.success({ message: "Success", description: "Flash sale deleted" });
      retry();
    } catch (error) {
      api.error({ message: "Error", description: "Failed to delete" });
    }
  };

  const onFinish = async (values: any) => {
    const payload = {
      name: values.name,
      startTime: values.startTime.toDate(),
      endTime: values.endTime.toDate(),
      status: values.status,
      products: values.products,
    };

    try {
      if (editingSale) {
        await flashSaleApi.updateFlashSale(editingSale._id, payload);
        api.success({ message: "Success", description: "Flash sale updated" });
      } else {
        await flashSaleApi.createFlashSale(payload);
        api.success({ message: "Success", description: "Flash sale created" });
      }
      setIsModalOpen(false);
      retry();
    } catch (error) {
      api.error({ message: "Error", description: "Failed to save" });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Start Time",
      dataIndex: "startTime",
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: boolean) => (
        <Tag color={s ? "green" : "red"}>{s ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Products",
      dataIndex: "products",
      render: (p: any[]) => p?.length || 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Flash Sale Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Create Flash Sale
        </Button>
      </div>

      <Table
        dataSource={sales?.data}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingSale ? "Edit Flash Sale" : "Create Flash Sale"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Campaign Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true }]}
          >
            <DatePicker showTime className="w-full" />
          </Form.Item>
          
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true }]}
          >
            <DatePicker showTime className="w-full" />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue={true}>
            <Select>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <h3 className="text-lg font-medium mb-2">Products</h3>
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    align="baseline"
                    className="flex w-full mb-2"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "productId"]}
                      rules={[{ required: true, message: "Missing product" }]}
                      style={{ flex: 2, minWidth: 300 }}
                    >
                      <Select placeholder="Select Product" showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={products.map(p => ({ label: p.name, value: p._id }))} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "flashSalePercent"]}
                      rules={[{ required: true, message: "Missing % sale" }]}
                    >
                      <InputNumber min={0} max={100} placeholder="% Sale" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "stockLimit"]}
                      initialValue={0}
                    >
                      <InputNumber placeholder="Limit" />
                    </Form.Item>
                    <DeleteOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Product
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {contextHolder}
    </div>
  );
};

export default FlashSaleManagement;
