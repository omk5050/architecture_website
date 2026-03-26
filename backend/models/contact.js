import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Phone must be 10 digits"]
  },
  company: String,
  budget: String,
  solution: String,
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);