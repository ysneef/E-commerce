import { Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";

type ProductImageModalProps = {
  visible: boolean;
  images: string[];
  onClose: () => void;
};

const ProductImageModal = ({ visible, images, onClose }: ProductImageModalProps) => {
  if(!images) return

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      bodyStyle={{ maxHeight: '70vh' }}
    >
      <div className="flex justify-around mt-5">
        {images?.map((img, index) => (
          <Avatar key={index} src={img}
          style={{
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
          }}
          shape="square" size={200} icon={<UserOutlined />} />

        ))}
      </div>
    </Modal>
  );
};

export default ProductImageModal;
