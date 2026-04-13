import mongoose from "mongoose";

const supportArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, default: "general" },
  },
  { timestamps: true }
);

const SupportArticle = mongoose.model("SupportArticle", supportArticleSchema);
export default SupportArticle;
