import { Breadcrumb, notification, Rate } from 'antd';
import Review from './components/Review';
import { formatNumber } from '@repo/ui';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncRetry } from 'react-use';
import ClientProductApi from './../../api/ClientProductApi';
import { setUser, UserState } from './../../features/userSlice';
import { OrderItem } from './../../types/Order';
import { Product } from './../../types/Product';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../app/store';

const ProductDetail = () => {
  const [api, contextHolder] = notification.useNotification();

  const location = useLocation();

  const productId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('id');
  }, [location.search]);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProduct = async (): Promise<Product | undefined> => {
    if (!productId) return undefined;

    try {
      const response = await ClientProductApi.getProductById(productId);
      return response.data as Product;
    } catch {
      return undefined;
    }
  };

  const { value: product, retry: ProductRetry } = useAsyncRetry(fetchProduct, [productId]);

  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);

  const selectedImage = product?.image[selectedIndex];

  useEffect(() => {
    if (product && product.sizes?.length > 0) {
      setSelectedSize(product.sizes[0].size);
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const selectedSizeStock = product?.sizes.find(
    (s) => s.size === selectedSize
  )?.quantity || 0;
  
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);


  const increaseQuantity = () => {
    if (quantity < selectedSizeStock) {
      setQuantity((prev) => prev + 1);
    }
  };


  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));




  const handleAddToCart = async () => {
    const cartItem: OrderItem = {
      productId: product?._id,
      name: product?.name,
      price: product?.price,
      discountPercent: product?.discountPercent || 0,
      image: product?.image,
      size: selectedSize || product?.sizes[0]?.size,
      quantity: quantity,
      

    };

    if (!user.userName || !user.email) {
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      api.error({
        message: "Error",
        description: "Please select size",
      });
      return;
    }


    const response = await ClientProductApi.manageCart({
      ...cartItem,
      action: 'add',
    });

    if (response.success) {
      api.success({
        message: 'Success',
        description: 'Product added successfully!',
      });

      dispatch(
        setUser({
          cart: response.cart,
          totalCart: response.totalCart,
        } as UserState)
      );
    } else {
      api.error({
        message: 'Error',
        description: response.message || 'Failed to add product',
      });
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto pt-28 pb-7">
      {/* Breadcrumb */}
      <div className="mb-5">
        <Breadcrumb
          separator=">"
          items={[
            { title: <Link to="/">Home</Link> },
            { title: <Link to="/category">Category</Link> },
            { title: product.name },
          ]}
        />

      </div>

      <div className="w-full py-10 bg-white">
        <div className="flex w-full gap-24 mb-5">
          {/* Product images */}
          <div className="flex gap-5 w-2/5">
            <div className="flex flex-col gap-5">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  className={`w-28 h-28 rounded-lg overflow-hidden cursor-pointer border bg-[#F0EEED] p-3 ${
                    selectedIndex === index ? 'border-black' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={image}
                    alt={`thumb-${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="w-[25rem] h-[25rem] rounded-xl overflow-hidden bg-[#F0EEED] p-3">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="w-3/5 xl:max-w-[35rem]">
            <h1 className="text-3xl font-extrabold mb-2">{product.name}</h1>

            <div className="flex items-center text-lg mb-2">
              <Rate allowHalf defaultValue={product.rating} disabled />
              <span className="ml-3">{product.rating}/5</span>
            </div>

            <div className="flex items-center gap-3 text-lg font-semibold mb-1">
              {product.price && (
                <span className="text-[#b3b3b3] line-through">
                  {formatNumber(product.price)} $
                </span>
              )}

              {product.discountPercent > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded">
                  -{product.discountPercent}%
                </span>
              )}
            </div>

            <span className="text-xl text-black font-bold mb-3">
              {formatNumber(product.discountPrice)} $
            </span>

            <p className="text-[#666666]">
              {product.description?.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <hr className="border-t border-gray-300 my-5" />

            {/* SIZE SECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800">Choose size</p>

                  <a
                    href="/size-guide"
                    className="flex items-center gap-2 text-black-800"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        d="M21.75 10.5v6.75a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V10.5m3.308-2.25h12.885m-12.885 0L8.21 5.599M5.558 8.25l2.652 2.652M18.443 8.25L15.79 5.599m2.653 2.651l-2.653 2.652M17.25 19v-2.5M12 19v-2.5M6.75 19v-2.5"
                      />
                    </svg>

                    <span>Size Guide</span>
                  </a>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => setSelectedSize(item.size)}
                    disabled={item.quantity === 0}
                    className={`min-w-[60px] px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                    ${
                      selectedSize === item.size
                        ? "bg-black text-white border-black shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
                    }
                    ${item.quantity === 0 ? "opacity-40 cursor-not-allowed" : ""}
                    `}
                  >
                    {item.size}
                  </button>
                ))}

                <p className="text-sm text-gray-500 mt-2">
                  {selectedSizeStock > 0
                    ? `${selectedSizeStock} items available`
                    : "Out of stock"}
                </p>


              </div>

              
            </div>

            <hr className="border-t border-gray-300 my-5" />

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-5 mt-5">
              <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-gray-100 w-28">
                <button className="text-xl font-bold" onClick={decreaseQuantity}>
                  -
                </button>

                <span className="text-lg">{quantity}</span>

                <button
                  className="text-xl font-bold"
                  onClick={increaseQuantity}
                  disabled={quantity >= selectedSizeStock}
                >
                  +
                </button>
              </div>

              <button
                disabled={selectedSizeStock === 0}
                className={`py-3 px-10 rounded-full flex-1 transition duration-300
                ${
                  selectedSizeStock === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                onClick={handleAddToCart}
              >
                {selectedSizeStock === 0 ? "Out of stock" : "Add to cart"}
              </button>

            </div>
          </div>
        </div>
      </div>

      <Review productId={productId} onReview={ProductRetry} />

      {contextHolder}
    </div>
  );
};

export default ProductDetail;

