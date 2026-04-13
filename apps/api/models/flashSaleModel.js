import mongoose from "mongoose";

const flashSaleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    products: [
      {
        productId: { type: String, ref: "Product", required: true },
        flashSalePercent: { type: Number, required: true },
        stockLimit: { type: Number, default: 0 },
      },
    ],
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

flashSaleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const FlashSale = mongoose.model("FlashSale", flashSaleSchema);

export default FlashSale;
