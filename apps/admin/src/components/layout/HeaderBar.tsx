import { LogoutOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Col, Dropdown, Form, Input, Menu, Modal, notification, Popconfirm, Row, Select } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../../app/store"
import UserApi from "../../pages/UserManagement/api/User.api"
import FormAvatarUpload from "../../pages/UserManagement/components/drawer/AddUser/form/FormAvatarUpload"

const HeaderBar = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const navigate = useNavigate();

  const handleMenuClick = async (e: any) => {
    if (e.key === "edit") {
      form.setFieldsValue({
        userName: user?.userName,
        currentPassword: "",
        newPassword: "",
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
        avatar: user?.avatar,
        role: user?.role || "user",
      });
      setIsEditVisible(true);
    } else if (e.key === "logout") {
      await UserApi.logoutUser();
      navigate("/login");
    }
  };

  const handleAvatarUploadChange = (imageUrl: string | null) => {
    form.setFieldValue("avatar", imageUrl);
  };

  const onFinish = async (values: any) => {
    try {
      const response = await UserApi.updateUser(user._id, values);

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
      const closeTimeout = setTimeout(() => {
        form.resetFields();
        setIsEditVisible(false);
      },500)
      return () => clearTimeout(closeTimeout)

    } catch (error) {
      console.log("🚀 ~ handleAddUser ~ error:", error);
    }
  };

  const handleCancel = () => {
    setIsEditVisible(false);
    form.setFieldsValue({
      userName: user?.userName,
      currentPassword: "",
      newPassword: "",
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      avatar: user?.avatar,
      role: user?.role || "user",
    });
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit" icon={<UserOutlined />}>Edit Profile</Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Avatar src={user?.avatar} icon={<UserOutlined />} style={{ cursor: "pointer" }} />
      </Dropdown>

      <Modal title="Update Profile" open={isEditVisible} onCancel={handleCancel} footer={null} width={1000}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Username" name="userName" rules={[{ required: true, message: "Please enter username!" }]}>
                <Input placeholder="Enter username" />
              </Form.Item>

              <Form.Item label="Current Password" name="currentPassword">
                <Input.Password placeholder="Enter current password" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    validator: (_, value) => {
                      const currentPassword = form.getFieldValue('currentPassword');
                      if (currentPassword && value && value.length >= 6) {
                        return Promise.resolve();
                      }
                      if (!value || value.length === 0) {
                        return Promise.resolve();
                      }
                      if (!currentPassword) {
                        return Promise.reject(new Error("Current password is required"));
                      }
                      
                      return Promise.reject(new Error("New password must be at least 6 characters"));
                    },
                  },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>

            </Col>

            <Col span={8}>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email!" }, { type: "email", message: "Invalid email format!" }]}>
                <Input placeholder="Enter email" />
              </Form.Item>
              
              <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter phone number!" }, { pattern: /^[0-9]{10,11}$/, message: "Invalid phone number!" }]}>
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item label="Address" name="address">
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Role" name="role">
                <Select placeholder="Select role">
                  <Select.Option value="user">User</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Avatar" name="avatar" valuePropName="value" >
                <FormAvatarUpload onChange={handleAvatarUploadChange} onUploadingChange={setUploading} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Popconfirm title="Update" onConfirm={() => form.submit()}>
              <Button type="primary" loading={uploading}>Save</Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      </Modal>

      {contextHolder}
    </>
  );
};


export default HeaderBar;
