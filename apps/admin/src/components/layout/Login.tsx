import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, notification } from "antd"
import _ from "lodash"
import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AdminApi } from "../../api/apiRequest"

interface LoginFormValues {
  username: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [api, contextHolder] = notification.useNotification();

  const urlParams = new URLSearchParams(location.search)
  const from = urlParams.get("url") || "/"
  const getUser = async (payload: LoginFormValues) => {
    const responese = await AdminApi.axiosPost({
      data: {
        endpoint: "/api/users/login",
        params: payload,
      },
    })
    return responese.data
  }

  const onFinish = async (values: LoginFormValues) => {
    console.log("Login:", values)
    const responese = await getUser(values)
    if(responese?.success){
      if (!_.isEmpty(responese) && responese.user.role === "admin") {
        navigate(from, { replace: true })
      }
    }else{
      api.error({
        message: "Error",
        description: "Invalid account or password",
      });
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
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <a className="text-blue-500 hover:underline" href="#">
                Quên mật khẩu?
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
