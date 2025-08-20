import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    passwordUpdatedAt: { type: Date, default: Date.now },
    resetTokenHash: String,
    resetTokenExp: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
