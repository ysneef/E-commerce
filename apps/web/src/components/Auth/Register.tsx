import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, notification } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserApi } from "../../api/userApi";

export type RegisterFormValues = {
  userName: string;
  email: string;
  password: string;
  phone: string;
  role: string
}

function Register() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await UserApi.register({
        ...values,
        role: 'user',
      });

      console.log('🚀 [Register] Response:', response);

      if (response.success) {
        api.success({
          message: "Success",
          description: "Registration successful!",
        });
        navigate('/login');
      } else {
        api.error({
          message: "Error",
          description: response.message || "Registration failed",
        });
      }
    } catch (error) {
      api.error({
        message: "Error",
        description: "An error occurred during registration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="max-w-lg w-full shadow-2xl rounded-2xl p-10 pb-6">
        <h2 className="text-4xl font-extrabold text-center mb-8">Register</h2>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="userName"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              {
                pattern: /^0\d{9}$/,
                message: "Invalid phone number!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone number"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item className="mt-5">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isLoading}
            >
              Register
            </Button>
          </Form.Item>

          <Form.Item>
            <div className="text-center text-sm text-gray-500 mt-2">
              Already have an account?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer font-medium"
                onClick={() => navigate("/login")}
              >
                Login now
              </span>
            </div>
          </Form.Item>
        </Form>
      </Card>
      {contextHolder}
    </div>
  );
}

export default Register;