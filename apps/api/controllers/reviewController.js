import { productModel, reviewModel } from "../models/productModel.js";
import userModel from "../models/userModel.js";

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      pageSize = 10,
      sortOrder = "desc",
      sortBy = "createdAt",
    } = req.query;

    const pageNum = parseInt(page);

    const { results, total } = await reviewModel.findByProduct(
      productId,
      pageNum,
      pageSize,
      sortBy,
      sortOrder
    );

    const userIds = results.map((review) => review.userId);

    const users = await userModel.findAll({ _id: { $in: userIds } }).lean();

    const moreInfo = {
      users: users.map((user) => ({
        ...user,
      })),
    };

    res.status(200).json({
      success: true,
      data: results,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNum,
      totalItems: total,
      ...moreInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while retrieving reviews",
      error: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !userId || !rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required information!" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5!",
      });
    }

    const [productExists, userExists] = await Promise.all([
      productModel.findById(productId),
      userModel.findById(userId),
    ]);

    if (!productExists || !userExists) {
      return res.status(404).json({
        success: false,
        message: !productExists
          ? "Product does not exist!"
          : "User does not exist!",
      });
    }

    const newReview = await reviewModel.createReview({
      productId,
      userId,
      rating,
      comment,
    });

    await updateProductRating(productId);

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating review",
      error: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingReview = await reviewModel.findById(id);

    if (!existingReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review does not exist!" });
    }

    const updatedReview = await reviewModel.updateReview(id, updateData);

    await updateProductRating(existingReview.productId);

    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review does not exist!" });
    }

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating review",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await reviewModel.deleteReview(id);

    if (!deletedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review does not exist!" });
    }

    await updateProductRating(deletedReview.productId);

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while deleting review",
      error: error.message,
    });
  }
};

const updateProductRating = async (productId) => {
  const reviews = await reviewModel.getReviewsByProductId(productId);

  if (!reviews || reviews.length === 0) {
    await productModel.updateById(productId, { rating: 5 });
    return;
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await productModel.updateById(productId, {
    rating: parseFloat(avgRating.toFixed(1)),
  });
};
