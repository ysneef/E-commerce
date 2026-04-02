import mongoose from "mongoose";
import baseModel from "./baseModel.js";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  userName: { type: String, required: true },
  avatar: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },

  // order: [{ type: String, ref: "Order" }],
  order: [{ type: String, ref: "Order" }],

  cart: [
    {
      productId: { type: String, required: true, ref: "Product" },
      name: { type: String },
      quantity: { type: Number, default: 1 },
      image: { type: [String] },
      price: { type: Number },
      discountPercent: { type: Number, default: 0 },
      size: { type: String },
    },
  ],

  // order: { type: [String], default: [] },
  // cart: { type: [String], default: [] },
  role: { type: String, required: true, enum: ["user", "admin"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export const User = mongoose.model("User", userSchema);

const userModel = {
  ...baseModel(User),
};

export default userModel;
