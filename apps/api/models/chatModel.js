import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    role: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    source: { type: String, default: "chatbot" },
  },
  { timestamps: true }
);

chatSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
