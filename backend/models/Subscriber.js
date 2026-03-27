import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
}, { timestamps: true });

export default mongoose.model("Subscriber", subscriberSchema);