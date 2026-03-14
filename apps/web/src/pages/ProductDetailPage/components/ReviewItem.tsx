import { Avatar, Popconfirm, Rate } from 'antd';
import React from 'react';
import { User } from '../../../types/User';
import { CheckCircleFilled, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { ProductApi } from '../../../api/productApi';

export type TReviewItem = {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
};

interface Props {
  review: TReviewItem;
  currentUserId: string;
  onEditClick?: (review: TReviewItem) => void;
  onDeleted?: () => void;
}

const ReviewItem: React.FC<Props> = ({ review, currentUserId, onEditClick, onDeleted }) => {
  const isMyReview = review.userId === currentUserId;

  const handleDelete = async () => {
    try {
      await ProductApi.deleteReviewProduct(review._id);
      onDeleted?.();
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error)
    }
  };

  return (
    <div className="border border-gray-300 rounded-2xl p-4 relative">
       {isMyReview && (
        <div className="absolute top-3 right-3 flex gap-2 text-gray-500">
          <EditOutlined
            className="hover:text-black cursor-pointer"
            onClick={() => onEditClick?.(review)}
          />
          <Popconfirm
            title="Are you sure you want to delete this review?"
            onConfirm={handleDelete}
            okText="Delete"
            cancelText="Cancel"
          >
            <DeleteOutlined className="hover:text-red-600 cursor-pointer" />
          </Popconfirm>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Avatar src={review.user?.avatar} alt={review.user?.avatar} icon={<UserOutlined />} size={50} />
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-semibold">{review.user?.userName}</span>
            <CheckCircleFilled style={{ color: '#01AB31', fontSize: 16 }} />
          </div>
          <span className="text-gray-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <Rate allowHalf value={review.rating} disabled style={{ fontSize: 20 }} className='my-3'/>

      <div className="text-gray-800">{review.comment}</div>
    </div>
  );
};

export default ReviewItem;
