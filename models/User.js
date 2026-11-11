import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    provider: { type: String, default: "credentials" },
    username: { type: String, unique: true, trim: true, sparse: true },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    image: { type: String, default: "" },
    coverPic: { type: String, default: "" },
    stripePublishableKey: { type: String, default: "" },
    stripeSecretKey: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);