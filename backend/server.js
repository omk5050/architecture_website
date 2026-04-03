import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();   // MUST be first

import authRoutes from "./routes/authRoutes.js";
import express from "express";
import cors from "cors";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: {
    success: false,
    message: "Too many requests. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const subscribeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many subscriptions. Try later."
  }
});

// Now env is available
connectDB();

app.use("/api/contact", contactLimiter, contactRoutes);

app.use("/api/subscribe", subscribeLimiter, subscriberRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
