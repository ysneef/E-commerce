import mongoose from "mongoose";
import baseModel from "./baseModel.js";

const reviewSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    productId: { type: String, required: true, ref: "Product" },
    userId: { type: String, required: true, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

reviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },

    name: { type: String, required: true },

    description: { type: String, required: true },

    price: { type: Number, required: true },

    discountPercent: { type: Number, default: 0 },

    image: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length === 3;
        },
        message: "Product must have exactly 3 images!",
      },
    },

    discountPrice: { type: Number, default: 0 },

    category: {
      type: String,
      enum: ["Men", "Women", "Kids"],
      required: true,
    },

    brand: {
      type: String,
      enum: [
        "Nike",
        "Adidas",
        "Puma",
        "New Balance",
        "Reebok",
        "Skechers",
        "Asics",
      ],
      required: true,
    },

    sizes: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Product must have at least one size!",
      },
    },

    rating: { type: Number, default: 5 },

    status: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },

    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);
const Review = mongoose.model("Review", reviewSchema);

const productModel = {
  ...baseModel(Product),
};

const reviewModel = {
  ...baseModel(Review),

  async findByProduct(
    productId,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  ) {
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({ productId });

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const results = await Review.find({ productId })
      .skip(skip)
      .limit(limit)
      .sort(sort);

    return { total, results };
  },

  async createReview(data) {
    return await Review.create(data);
  },

  async updateReview(id, data) {
    return await Review.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteReview(id) {
    return await Review.findByIdAndDelete(id);
  },

  getReviewsByProductId: async (productId) => {
    return await Review.find({ productId });
  },
};

export { productModel, reviewModel };
