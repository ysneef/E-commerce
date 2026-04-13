import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Card, Checkbox, Form, Input, notification } from "antd"
import _ from "lodash"
import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LoginFormValues, UserApi } from "../../api/userApi"

const Login: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification()

  const urlParams = new URLSearchParams(location.search)
  const from = urlParams.get("url") || "/"

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await UserApi.login(values)
      if (response?.success) {
        if (!_.isEmpty(response) && response.user) {
          // if (response.user.role === "admin") {
          //   window.location.href = "http://localhost:3002"
          // } else if (response.user.role === "user") {
          //   const path = from === "/" ? "" : from
          //   window.location.href = `http://localhost:3000${path}`
          // } else {
          //   api.error({
          //     message: "Error",
          //     description: "Invalid role",
          //   })
          // }

          const path = from === "/" ? "" : from
          const baseUrl = import.meta.env.VITE_WEB_BASE_URL || window.location.origin
          window.location.href = `${baseUrl}${path}`
        } else {
          api.error({
            message: "Error",
            description: "User information not found",
          })
        }
      } else {
        api.error({
          message: "Error",
          description: response.message || "Invalid account",
        })
      }
    } catch (error) {
      api.error({
        message: "Error",
        description: "An error occurred during login.",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="max-w-[400px] w-full shadow-2xl rounded-2xl p-8 mb-4">
        <h2 className="text-3xl font-extrabold text-center mb-6">Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="userName"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
              >
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <div className="text-center text-sm text-gray-500 mt-2">
              Don't have an account?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer font-medium"
                onClick={() => navigate("/register")}
              >
                Register now
              </span>
            </div>
          </Form.Item>
        </Form>
      </Card>
      {contextHolder}
    </div>
  )
}

export default Login
