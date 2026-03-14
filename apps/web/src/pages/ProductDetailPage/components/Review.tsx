import { DownOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification, Rate, Tabs } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsyncRetry } from 'react-use';
import ClientProductApi from '../../../api/ClientProductApi';
import { ProductApi } from '../../../api/productApi';
import { RootState } from '../../../app/store';
import { Product } from '../../../types/Product';
import { User } from '../../../types/User';
import New_Arrival from '../../HomePage/components/New-Arrival';
import ReviewItem, { TReviewItem } from '../components/ReviewItem';
import { Link } from "react-router-dom";


interface ReviewProps {
  productId: string | null;
  onReview: () => void
}

const Review: React.FC<ReviewProps> = ({ productId, onReview }) => {
  const [userReviews, setUserReviews] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const userInfo = useSelector((state: RootState) => state.user);
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);

  const [api, contextHolder] = notification.useNotification();
  
  const [criteria, setCriteria] = useState({
    pageSize: 4,
    sortOrder: "desc"
  });

  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await ClientProductApi.getClientProducts({
        page: 1,
        pageSize: 8,
      })
      return response.data;
    } catch (error) {
      return []
    }
  };
  
  const { value: products = [] } = useAsyncRetry(fetchProducts, []);

  const fetchReviews = async (): Promise<TReviewItem[]> => {
    if (!productId) return [];

    try {
      const response = await ProductApi.getReviewProduct(productId, criteria);
      setUserReviews(response.users) 
      return response.data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  const { value: reviews = [], retry: reviewRetry } = useAsyncRetry(fetchReviews, [criteria, productId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmitReview = async () => {
    try {
      if(!user.userName || !user.email){
        api.error({
          message: "Error",
          description: "Please login to review",
        });
        return
      }
      const values = await form.validateFields();
      const payload = {
        productId,
        userId: userInfo._id,
        rating: values.rating,
        comment: values.comment,
      };

      let response;
      if (editReviewId) {
        response = await ProductApi.updateReviewProduct(editReviewId, payload);
      } else {
        response = await ProductApi.createReviewProduct(payload);
      }

      onReview()

      if (response.success) {
        reviewRetry();
        api.success({
          message: "Success",
          description: editReviewId ? 'Review updated!' : 'Thank you for your review!',
        });
        setIsModalOpen(false);
        form.resetFields();
        setEditReviewId(null);
      }

    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const toggleSortOrder = () => {
    setCriteria(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <>
      <div className="px-10 mb-20">
        <Tabs
          defaultActiveKey="2"
          centered
          items={[
            {
              key: '1',
              label: 'Product Details',
              children: (
                <div className="p-6 text-gray-700 leading-relaxed">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* LEFT */}
                    <div className="space-y-6">

                      <div>
                        <h2 className="text-xl font-semibold text-black mb-2">
                          Product Description
                        </h2>
                        <p>
                          Designed for comfort and everyday style, these shoes combine
                          modern design with high-quality materials to provide durability
                          and a comfortable fit.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg text-black mb-2">
                          Key Features
                        </h3>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Premium quality materials</li>
                          <li>Breathable design</li>
                          <li>Lightweight sole</li>
                          <li>Modern and stylish look</li>
                        </ul>
                      </div>

                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">

                      <div>
                          <Link
                          to="/size-guide"
                          className="font-semibold text-lg text-black mb-2"
                        >
                          Size Guide
                        </Link>
                        <p>
                          Measure your foot length to choose the most accurate size.
                        </p>

                        <p className="text-sm italic mt-2">
                          If you have wide feet, choose 0.5 size larger.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg text-black mb-2">
                          Shipping
                        </h3>

                        <ul className="list-disc pl-6 space-y-1">
                          <li>Orders processed within 24 hours</li>
                          <li>Nationwide delivery</li>
                          <li>Products inspected before shipping</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg text-black mb-2">
                          Returns & Refunds
                        </h3>

                        <ul className="list-disc pl-6 space-y-1">
                          <li>Defective product</li>
                          <li>Wrong size delivered</li>
                          <li>Incorrect product received</li>
                        </ul>
                      </div>

                    </div>

                  </div>

                </div>

              ),
            },
            {
              key: '2',
              label: 'Rating & Reviews',
              children: (
                <>
                  <div className="flex justify-between items-center flex-wrap gap-4 mb-5">
                    <div className="flex items-center ml-5">
                      <div className="font-bold text-2xl">All Reviews</div>
                      <div className="text-gray-500 ml-2">({reviews.length})</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        type='primary'
                        className="px-4 py-2 rounded-full bg-white text-black shadow-none flex items-center gap-1"
                        onClick={toggleSortOrder}
                      >
                        <FilterOutlined />
                        <span>{criteria.sortOrder === 'desc' ? 'Latest' : 'Oldest'}</span>
                        <DownOutlined className="text-lg" />
                      </Button>
                      <Button
                        type='primary'
                        className="px-4 py-2 rounded-full bg-black  shadow-none text-white text-sm"
                        onClick={handleOpenModal}
                      >
                        Write a Review
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-4">
                    {reviews.map((review, index) => {
                      const user = userReviews.find(user => user._id === review.userId);
                      return (
                        <ReviewItem
                          key={index}
                          review={{ ...review, user }}
                          currentUserId={userInfo?._id || ""}
                          onEditClick={(review) => {
                            form.setFieldsValue({
                              rating: review.rating,
                              comment: review.comment,
                            });
                            setIsModalOpen(true);
                            setEditReviewId(review._id);
                          }}
                          onDeleted={() => {
                            onReview();
                            reviewRetry();
                          }}
                        />
                      );
                    })}
                  </div>

                  {reviews.length > 0 
                    ? (
                      <div className="flex justify-center items-center mt-5">
                        <Button 
                          className="border border-gray-500 rounded-full px-6 py-2 bg-transparent hover:bg-gray-100 transition"
                          onClick={() => setCriteria(prev => ({
                            ...prev,
                            pageSize: prev.pageSize + 4
                          }))}
                        >
                          Load More Reviews
                          </Button>
                      </div>
                    ) 
                    : null
                  }
                </>
              ),
            }
          ]}
        />
      </div>
      <div className="flex justify-center font-extrabold text-4xl font-sans mt-10">
        YOU MIGHT ALSO LIKE
      </div>
      <New_Arrival showtitle={false} products={products} />

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-review-modal"
      >
        <div className="p-6 rounded-xl bg-white">
          <div className="text-2xl font-semibold mb-4 text-center">Write a Review</div>

          <Form form={form} layout="vertical" onFinish={handleSubmitReview} initialValues={{ rating: 5 }}>
            <Form.Item
              name="rating"
              label={<span className="font-medium">Your Rating</span>}
              rules={[{ required: true, message: 'Please give a rating' }]}
              className="flex justify-start w-full"
            >
              <Rate allowHalf style={{ fontSize: 28 }} className='w-full' />
            </Form.Item>

            <Form.Item
              name="comment"
              label={<span className="font-medium">Your Comment</span>}
              rules={[{ required: true, message: 'Please enter your comment' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Share your experience..."
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      {contextHolder}

    </>
  );
};

export default Review;
