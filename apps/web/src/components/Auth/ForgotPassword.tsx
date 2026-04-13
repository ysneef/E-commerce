import React, { useState } from "react";
import { Button, Card, Form, Input, notification, Spin } from "antd";
import { MailOutlined, LockOutlined, KeyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { UserApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  // STEP 1: Send OTP
  const handleSendOTP = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await UserApi.forgotPassword(values.email);

      if (response?.success) {
        setEmail(values.email);
        setStep(2);

        api.success({
          message: "Success",
          description: "OTP has been sent to your email.",
        });
      } else {
        api.error({
          message: "Error",
          description: response?.message || "Failed to send OTP",
        });
      }
    } catch (error) {
      api.error({
        message: "System Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Reset Password
  const handleResetPassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      api.error({
        message: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      };

      const response = await UserApi.resetPassword(payload);

      if (response?.success) {
        api.success({
          message: "Success",
          description: "Password reset successfully. Redirecting to login...",
        });

        setTimeout(() => navigate("/login"), 2000);
      } else {
        api.error({
          message: "Error",
          description: response?.message || "Invalid or expired OTP",
        });
      }
    } catch (error) {
      api.error({
        message: "System Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {contextHolder}

      <Card className="max-w-lg w-full shadow-2xl rounded-2xl p-10 pb-6 relative">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          className="absolute top-4 left-4"
          onClick={() => {
            if (step === 2) setStep(1);
            else navigate("/login");
          }}
        />

        <h2 className="text-4xl font-extrabold text-center mb-8 mt-4">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        <Spin spinning={loading}>
          {step === 1 ? (
            <Form onFinish={handleSendOTP} layout="vertical">
              <p className="text-gray-500 text-sm text-center mb-6">
                Enter your email and we will send you an OTP to reset your password.
              </p>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email address" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form onFinish={handleResetPassword} layout="vertical">
              <p className="text-gray-500 text-sm text-center mb-6">
                OTP has been sent to <b>{email}</b>
              </p>

              <Form.Item
                name="otp"
                rules={[{ required: true, message: "Please enter OTP!" }]}
              >
                <Input prefix={<KeyOutlined />} placeholder="Enter 6-digit OTP" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter new password!" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="New password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[{ required: true, message: "Please confirm password!" }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default ForgotPassword;
