import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Layout/PrivateRoute';
import CartPage from './pages/CartPage';
import Category from './pages/CategoryPage';
import HomePage from './pages/HomePage';
import Header from './components/Layout/Header';
import { ConfigProvider } from 'antd';
import Orders from './pages/order';
import Footer from './components/Layout/Footer';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetailPage';
import SizeGuide from './pages/SizeGuide';


const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

const Router = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8e00e8',
        },
        components: {
          Table: {
            headerBg: '#F5F5F5',
          },
          Button: {
            borderRadius: 10,
            padding: 10,
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <HomePage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/product"
            element={
              <PrivateRoute>
                <AppLayout>
                  <ProductDetail />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/category"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Category />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CartPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Orders />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/size-guide"
            element={
              <PrivateRoute>
                <AppLayout>
                  <SizeGuide />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route path="/category" element={<Category />} />
          <Route path="/brand/:brand" element={<Category />} />

        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default Router;
