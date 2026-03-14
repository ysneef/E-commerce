import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import {
  faCartShopping
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatNumber } from '@repo/ui';
import { Avatar, Badge, Button, Dropdown, Menu, Select, Spin } from 'antd';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ClientApi } from '../../api/apiRequest';
import { ProductApi } from '../../api/productApi';
import { RootState } from '../../app/store';
import { clearUser } from '../../features/userSlice';
import { Product } from '../../types/Product';

function Header() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  console.log("🚀 ~ Header ~ user:", user)
  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleSearch = debounce(async(value: string) => {
    if (value === searchTerm) return; 
    setSearchTerm(value);
    setIsLoading(true);
    try {
      const products = await ProductApi.searchProducts({
        page: 1,
        pageSize: 4,
        freeText: value
      })
      
      setSuggestions(products.data || []);
    } catch (err) {
      console.error('Search failed:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  },500);

  const handleSelect = (productId: string) => {
    navigate(`/product?id=${productId}`)
  };

  const handleMenuClick = async (e: any) => {
    if (e.key === "edit") {
      navigate("/profile")
    } else if(e.key === "orders") {
      navigate("/orders")
    } else if (e.key === "logout") {
      try {
        const response = await ClientApi.axiosPost({
          data: {
            endpoint: '/api/users/logout',
            params: {},
          },
        });
        if (response?.data?.success) {
          dispatch(clearUser())
          
        }
      } catch (err) {
        console.error('Logout failed:', err);
        dispatch(clearUser())
        navigate("/")
      }
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit" icon={<UserOutlined />}>Edit Profile</Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
      {(user?.orders||[])?.length > 0 && (
        <Menu.Item key="orders" icon={<UserOutlined />}>
          Orders
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-screen-xl mx-auto py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold whitespace-nowrap">
          SHOES STORE
        </Link>

        <div className='flex gap-3 items-center'>
          <Link to="/category" className="text-gray-700">New Arrivals</Link>

          <div className="relative">
            <Select
              showSearch
              className="w-full sm:w-[300px] rounded-full"
              placeholder="Search for products"
              value={searchTerm}
              onSearch={handleSearch}
              onSelect={handleSelect}
              notFoundContent={isLoading ? <Spin size="small" /> : null}
              filterOption={false}
            >
              {suggestions.map((product) => (
                <Select.Option key={product._id} value={product._id} label={product.name}>
                  <div className="flex items-center">
                    <img src={product.image[0]} alt={product.name} className="w-14 h-14 object-cover rounded-md mr-2" />
                    <div className="flex flex-col">
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-sm text-gray-500">{product.description}</span>
                      <div className="flex items-center">
                        <span className="font-medium">{formatNumber(product.price)} $</span>
                        {product.discountPercent > 0 && (
                          <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                            -{product.discountPercent}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">{'★'.repeat(product.rating)}</span>
                      </div>
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>

            {isLoading && (
              <div className="absolute w-full flex justify-center mt-1">
                <Spin size="small" />
              </div>
            )}
          </div>

        </div>

        <div className="flex items-center gap-4">
          {user.userName && user.email ? (
            <>
              <Link to="/cart" className="relative" aria-label="Cart">
                <Badge count={user?.totalCart} size="small">
                  <FontAwesomeIcon icon={faCartShopping} className="text-xl text-gray-700" />
                </Badge>
              </Link>

              <Dropdown overlay={menu} trigger={["click"]}>
                <Avatar src={user?.avatar} icon={<UserOutlined />} style={{ cursor: "pointer" }} />
              </Dropdown>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to={`/login?url=${encodeURIComponent(location.pathname + location.search)}`}>
                <Button type="primary">Login</Button>
              </Link>
              <Link to="/register">
                <Button type="default">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;