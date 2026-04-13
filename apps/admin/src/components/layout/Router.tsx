import { BrowserRouter, Routes, Route } from "react-router-dom"
import LayoutWrapper from "./LayoutWrapper"
import DashboardContent from "../../pages/Dashboard/DashboardContent"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import UserManagement from "../../pages/UserManagement"
import { ConfigProvider } from "antd"
import ProductManagement from "../../pages/productManagement"
import OrderManagement from "../../pages/OrderManagement"
import FlashSaleManagement from "../../pages/FlashSaleManagement"

const Router = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#8e00e8",
        },
        components: {
          Table: {
            headerBg: "#F5F5F5"
          },
        },
      }}
    >
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <PrivateRoute>
                <LayoutWrapper>
                  <Routes>
                    <Route path="/" element={<DashboardContent />} />
                    <Route path="/customers/list" element={<UserManagement />} />
                    <Route path="/products/list" element={<ProductManagement />} />
                    <Route path="/orders/list" element={<OrderManagement />} />
                    <Route path="/flash-sale" element={<FlashSaleManagement />} />
                  </Routes>
                </LayoutWrapper>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default Router
