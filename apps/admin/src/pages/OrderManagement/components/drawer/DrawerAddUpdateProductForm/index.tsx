import { UploadOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, InputNumber, Select, Switch, Upload } from "antd";
import { useEffect, useState } from "react";
import CategorySelect from "./CategorySelect";
import { TProduct } from "../../../../productManagement/models/Product.model";

interface UploadedImage {
  uid: string | number;
  url?: string;
  name?: string;
  response?: { url: string };
  originFileObj?: File;
}

interface DrawerAddUpdateProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TProduct) => void;
  initialValues?: TProduct | null;
}

const DrawerAddUpdateProductForm: React.FC<DrawerAddUpdateProductFormProps> = ({ open, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setImageList(
        initialValues.image
          ? initialValues.image.map((url, index) => ({
            uid: String(index),
            url,
            name: `Hình ${index + 1}`,
          }))
          : []
      );
    } else {
      form.resetFields();
      setImageList([]);
    }
  }, [initialValues, open]);

  const handleUploadChange = async ({ fileList }: { fileList: UploadedImage[] }) => {
    const newImageList = await Promise.all(
      fileList.map(async (file) => {
        console.log("🚀 ~ fileList.map ~ file:", file)
        if (!file.url && (file.originFileObj)) {
          const base64 = await convertFileToBase64(file.originFileObj);
          return {
            uid: file.uid,
            url: base64,
            name: file.name,
          };
        }
        return file;
      })
    );

    setImageList(newImageList);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };


  const handleSubmit = (values: TProduct) => {
    setLoading(true)
    values.image = imageList.map((file) => file.url || file.response?.url) as string[];
    if (initialValues?._id) {
      (values as any)._id = initialValues._id;
    }

    onSubmit(values);
    setLoading(false)
  };

  return (
    <Drawer title={initialValues ? "Update Product" : "Add Product"} open={open} onClose={onClose} width={500} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Please enter product name" }]}>
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price" }]}>
          <InputNumber className="w-full" min={0} placeholder="Nhập giá" addonAfter="$" />
        </Form.Item>

        <Form.Item name="brand" label="Brand" rules={[{ required: true, message: "Please select brand!" }]}>
          <Select placeholder="Select brand">
            <Select.Option value="Nike">Nike</Select.Option>
            <Select.Option value="Adidas">Adidas</Select.Option>
            <Select.Option value="Puma">Puma</Select.Option>
            <Select.Option value="New Balance">New Balance</Select.Option>
            <Select.Option value="Reebok">Reebok</Select.Option>
            <Select.Option value="Skechers">Skechers</Select.Option>
            <Select.Option value="Asics">Asics</Select.Option>
          </Select>
        </Form.Item>


        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category!" }]}
          getValueProps={(value) => ({ value })}
        >
          <CategorySelect />
        </Form.Item>


        <Form.Item
          name="description"
          label="Product Description"
          rules={[{ required: true, message: "Please enter product description!" }]}
        >
          <Input.TextArea placeholder="Enter product description" rows={4} />
        </Form.Item>


        <Form.Item
          name="status"
          label="Status"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        {/* <Form.Item name="rating" label="Rating">
          <InputNumber className="w-full" min={0} max={5} step={0.5} />
        </Form.Item> */}

        <Form.Item name="image" label="Images">
          <Upload listType="picture-card" fileList={imageList as any} onChange={handleUploadChange} beforeUpload={() => false}>
            {imageList.length >= 3 ? null : <UploadOutlined />}
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-2 sticky bottom-0">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            {initialValues ? "Update" : "Add"}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default DrawerAddUpdateProductForm;
