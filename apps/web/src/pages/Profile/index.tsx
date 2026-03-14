import { Button, Form, Input, notification, Popconfirm, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserApi } from "../../api/userApi";
import { RootState } from "../../app/store";
import FormAvatarUpload from "./FormAvatarUpload";

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar || "",
      });
    }
  }, [form, user]);

  const handleAvatarUploadChange = (imageUrl: string | null) => {
    form.setFieldValue("avatar", imageUrl);
  };

  const onFinish = async (values: any) => {
    try {
      const response = await UserApi.updateUser(user?._id || "", values);

      if (!response.success) {
        api.error({
          message: "Error",
          description: response.message || "Invalid data!",
        });
        return;
      }

      api.success({
        message: "Success",
        description: "Profile updated successfully!",
      });

    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">

      <div className="text-center mb-6">
        <Title level={2} className="text-blue-600">My Profile</Title>
        <Text className="text-gray-500">
          Update your personal information below
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <Form.Item
            label="Username"
            name="userName"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Invalid email address!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Current Password"
            name="currentPassword"
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                validator: (_, value) => {
                  const currentPassword = form.getFieldValue("currentPassword");

                  if (!value) return Promise.resolve();

                  if (!currentPassword) {
                    return Promise.reject(
                      new Error("Current password is required")
                    );
                  }

                  if (value.length < 6) {
                    return Promise.reject(
                      new Error("New password must be at least 6 characters")
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Invalid phone number!",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input placeholder="Enter your address" />
          </Form.Item>

          <Form.Item
            label="Profile Picture"
            name="avatar"
            valuePropName="value"
            className="col-span-2 text-center"
          >
            <FormAvatarUpload
              onChange={handleAvatarUploadChange}
              onUploadingChange={setUploading}
              value={form.getFieldValue("avatar")}
            />
          </Form.Item>

        </div>

        <Popconfirm
          title="Confirm update?"
          onConfirm={() => form.submit()}
        >
          <Button
            type="primary"
            loading={uploading}
            className="mt-10 w-1/2 mx-auto"
          >
            Save Changes
          </Button>
        </Popconfirm>

      </Form>

      {contextHolder}

    </div>
  );
};

export default Profile;
