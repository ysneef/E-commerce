import { Drawer } from "antd";
import { IProductOrder } from "../../../models/Product.model";


interface DrawerProductDetailProps {
  visible: boolean;
  onClose: () => void;
  products: IProductOrder[];
}

const DrawerProductDetail: React.FC<DrawerProductDetailProps> = ({ visible, onClose, products = [] }) => {
  console.log("🚀 ~ products:", products)
  return (
    <Drawer
      title="Product Details"
      width={1000}
      open={visible}
      onClose={onClose}
      bodyStyle={{ padding: "24px" }}
    >
      {products.length > 0 ? (
        <div className="flex flex-col gap-6">
          {products.map((item, index) => (
            <div key={index} className="relative p-4 border rounded-lg">
              {item.discountPercent > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  -{item.discountPercent}%
                </span>
              )}

              <div className="flex gap-2 overflow-x-auto mb-4">
                {item.image && item.image.length > 0 ? (
                  item.image.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img}
                      alt={item.name}
                      style={{ width: 400, height: 400, objectFit: "cover" }}

                    />
                  ))
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">
                      Total Price: {(item.price).toLocaleString()} $
                    </p>

                    <p className="text-lg font-bold text-blue-600">
                      Final Price: {(item.totalPrice)?.toLocaleString()} $
                    </p>
                  </div>

                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Size: </span>
                  <span className="text-sm text-gray-600">{item.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products available.</p>
      )}
    </Drawer>
  );
};

export default DrawerProductDetail;
