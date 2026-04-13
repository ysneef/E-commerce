import { Button, Drawer, Form, Input, Select } from 'antd';
import FormAvatarUpload from './form/FormAvatarUpload.tsx';
import { useEffect, useState } from 'react';

type AddUserProps = {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  onClose: () => void;
  loading?: boolean;
  visible: boolean;
};

export type AddUserValues = {
  userName: string;
  email: string;
  password: string;
  address: string;
  role: string;
};

const AddUser: React.FC<AddUserProps> = ({
  onSubmit,
  onCancel,
  loading,
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const handleAvatarUploadChange = (imageUrl: string | null) => {
    form.setFieldValue('avatar', imageUrl);
  };

  const handleFinish = (values: AddUserValues) => {
    onSubmit({
      ...values,
    });
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Drawer
      title="Add User"
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="User Name"
          name="userName"
          rules={[{ required: true, message: 'Please enter the user name!' }]}
        >
          <Input placeholder="Enter user name" />
        </Form.Item>

        <Form.Item
            label="Password"
            name="password"
            rules={[
                {
                    required: true, message: "Please enter the password!",
                    validator: (_, value) => {
                        if (!value || value.length >= 6) return Promise.resolve();
                        return Promise.reject("Password must be at least 6 characters!");
                    },
                },
            ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter the email!" },
            { type: 'email', message: "Invalid email format!"},
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: 'Enter phone number' },
            {
              pattern: /^[0-9]{10,11}$/,
              message: 'The phone number is invalid!',
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter the address!' }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select a role!">
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>


        <Form.Item label="Avatar" name="avatar">
          <FormAvatarUpload
            onChange={handleAvatarUploadChange}
            onUploadingChange={(isUploading) => setUploading(isUploading)}
          />
        </Form.Item>

        <div className="flex justify-end gap-2 sticky bottom-0">
          <Button onClick={onCancel} disabled={uploading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || uploading}
          >
            Add
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default AddUser;
