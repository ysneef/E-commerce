import { UserOutlined } from "@ant-design/icons";
import { Avatar, message, Upload } from "antd";
import { useEffect, useState } from "react";
import { uploadImageToCloudinary } from "../../../../../../Utils/Funtions";

interface FormAvatarUploadProps {
  value?: string;
  onChange?: (file: string | null) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

const FormAvatarUpload: React.FC<FormAvatarUploadProps> = ({ onChange, onUploadingChange, value=null }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(value);

  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  const beforeUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    try {
      onUploadingChange?.(true)
      const uploadedImageUrl = await uploadImageToCloudinary(file);
      setImageUrl(uploadedImageUrl);
      onChange?.(uploadedImageUrl);
      onSuccess?.({ url: uploadedImageUrl }, file);
    } catch (error) {
      message.error("Image upload failed!");
      onError?.(error);
    } finally {
      onUploadingChange?.(false)
    }
  };

  return (
    <Upload
      name="file"
      listType="picture-circle"
      maxCount={1}
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={handleUpload}
    >
      <Avatar size={100} src={imageUrl || undefined} icon={!imageUrl ? <UserOutlined /> : undefined} />
    </Upload>
  );
};

export default FormAvatarUpload;