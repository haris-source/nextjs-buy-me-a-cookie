import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    to_username: { type: String, required: true, lowercase: true, trim: true },
    supporterName: { type: String, default: "Anonymous" },
    message: { type: String, default: "" },
    amount: { type: Number, required: true },
    cookieCount: { type: Number, default: 1 },
    stripeSessionId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);