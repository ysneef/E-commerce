import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, notification } from "antd"
import _ from "lodash"
import React from "react"
import { useLocation } from "react-router-dom"
import { LoginFormValues, UserApi } from "../../api/userApi"

const Login: React.FC = () => {
  const location = useLocation()
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
          window.location.href = `http://localhost:3000${path}`
        } else {
          api.error({
            message: "Error",
            description: "User information not found",
          })
        }
      } else {
        api.error({
          message: "Error",
          description: "Invalid account",
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
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

          {/* <Form.Item>
            <div className="flex justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a className="text-blue-500 hover:underline" href="#">
                Forgot password?
              </a>
            </div>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
            {/* <Button type="primary" className="w-full" onClick={test}>
                    Get
                </Button> */}
          </Form.Item>
        </Form>
      </Card>
      {contextHolder}
    </div>
  )
}

export default Login
