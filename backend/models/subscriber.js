import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  ip: String,
  userAgent: String
}, { timestamps: true });

export default mongoose.model("Subscriber", subscriberSchema);