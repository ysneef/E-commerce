import { Button, Drawer, Form, Input, InputNumber, Select, Switch, Upload, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { TProduct } from "../../../models/Product.model";
import CategorySelect from "./CategorySelect";
import { uploadImageToCloudinary } from "../../../../../Utils/Funtions";

const sizeMap: Record<string, string[]> = {
  men: [
    "EU 38", "EU 38.5", "EU 39", "EU 39.5", "EU 40",
    "EU 40.5", "EU 41", "EU 41.5", "EU 42", "EU 42.5",
    "EU 43", "EU 43.5", "EU 44", "EU 44.5", "EU 45",
    "EU 45.5", "EU 46", "EU 47"
  ],
  women: [
    "EU 35", "EU 35.5", "EU 36", "EU 36.5", "EU 37",
    "EU 37.5", "EU 38", "EU 38.5", "EU 39", "EU 39.5",
    "EU 40", "EU 40.5", "EU 41", "EU 41.5", "EU 42"
  ],
  kids: [
    "EU 21", "EU 22", "EU 23", "EU 24", "EU 25",
    "EU 26", "EU 27", "EU 28", "EU 29", "EU 30",
    "EU 31", "EU 32", "EU 33", "EU 34", "EU 35"
  ]
};


interface DrawerAddUpdateProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TProduct) => void;
  initialValues?: TProduct | null;
}

const DrawerAddUpdateProductForm: React.FC<DrawerAddUpdateProductFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {

  const [form] = Form.useForm();
  const [imageList, setImageList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        sizes: initialValues?.sizes || []
      });
      setImageList(initialValues.image || []);

      if (initialValues?.category) {
        const categoryStr = typeof initialValues.category === 'object' 
          ? (initialValues.category as any).name || '' 
          : String(initialValues.category);
        setSelectedCategory(categoryStr.toLowerCase());
      }

    } else {
      form.resetFields();
      setImageList([]);
      setSelectedCategory(null);
    }
  }, [initialValues, open]);


  const handleUploadChange = async ({ fileList }: { fileList: any[] }) => {

    setIsUploading(true);

    const uploadedUrls = await Promise.all(
      fileList.map(async (file) => {
        if (file.url) return file.url;

        if (file.originFileObj) {
          return await uploadImageToCloudinary(file.originFileObj);
        }

        return null;
      })
    );

    setImageList(uploadedUrls.filter(Boolean) as string[]);
    setIsUploading(false);
  };

  const handleSubmit = (values: TProduct) => {

    if (imageList.length < 3) {
      form.setFields([
        {
          name: "image",
          errors: ["Please upload 3 images!"],
        },
      ]);
      return;
    }

    setLoading(true);

    values.image = imageList;

    if (initialValues?._id) {
      (values as any)._id = initialValues._id;
    }

    onSubmit(values);

    setLoading(false);
  };

  return (
    <Drawer
      title={initialValues ? "Update Product" : "Add Product"}
      open={open}
      onClose={onClose}
      width={500}
      destroyOnClose
    >

      <Form form={form} layout="vertical" onFinish={handleSubmit}>

        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            placeholder="Enter price"
            addonAfter="USD"
          />
        </Form.Item>

        <Form.Item
          name="discountPercent"
          label="Discount (%)"
        >
          <InputNumber
            className="w-full"
            min={0}
            max={100}
            placeholder="0"
          />
        </Form.Item>

        <Form.Item
          name="brand"
          label="Brand"
          rules={[{ required: true, message: "Please select a brand!" }]}
        >
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
        >
          <CategorySelect
            onChange={(value: string) => {
              const key = value.toLowerCase();
              setSelectedCategory(key);
              form.setFieldsValue({ sizes: [] }); // reset size
            }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Product Description"
          rules={[{ required: true, message: "Please enter product description!" }]}
        >
          <Input.TextArea
            placeholder="Enter product description"
            rows={4}
          />
        </Form.Item>

        <Form.Item label="Sizes">
          <Form.List name="sizes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "size"]}
                      rules={[{ required: true, message: "Select size" }]}
                    >
                      <Select
                        placeholder="Size"
                        style={{ width: 120 }}
                        disabled={!selectedCategory}
                        options={
                          selectedCategory
                            ? sizeMap[selectedCategory]?.map((s) => ({
                              label: s,
                              value: s,
                            }))
                            : []
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Enter quantity" }]}
                    >
                      <InputNumber
                        placeholder="Qty"
                        min={0}
                        style={{ width: 120 }}
                        disabled={!selectedCategory}
                      />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block
                    disabled={!selectedCategory}
                  >
                    Add Size
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>


        <Form.Item
          name="status"
          label="Status"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="image"
          label="Images"
        >
          <Upload
            listType="picture-card"
            maxCount={8}
            fileList={imageList.map((url, index) => ({
              url,
              uid: String(index),
            }))}
            onChange={handleUploadChange}
            beforeUpload={() => false}
          >
            {imageList.length >= 3 ? null : <UploadOutlined />}
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-2 sticky bottom-0">

          <Button
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>

          <Button
            loading={loading || isUploading}
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
