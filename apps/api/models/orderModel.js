import mongoose from "mongoose"
import baseModel from "./baseModel.js";

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    user: {
      type: new mongoose.Schema(
        {
          _id: { type: String, required: true },
          phone: { type: String, required: true },
          avatar: { type: String, required: true },
          userName: { type: String, required: true },
          email: { type: String, required: true },
          avatar: { type: String, required: false }
        },
      ),
      required: true
    },
    items: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: [String] },
        price: { type: Number, required: true },
        discountPercent: { type: Number, default: 0 },
        totalPrice: { type: Number, required: true },
        size: { type: String, required: true },
        discountPrice: { type: Number, default: 0 },
      },
    ],
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    // status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

const orderModel = {
  ...baseModel(Order),
};

export default orderModel;