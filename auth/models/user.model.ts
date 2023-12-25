import mongoose, { Document, Model } from "mongoose";

interface UserDocument extends Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserDocument, Model<UserDocument>>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model<UserDocument>("User", userSchema);