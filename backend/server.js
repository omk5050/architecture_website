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
import helmet from "helmet";

const app = express();

// ─── Trust Render's proxy (required for rate-limiter to see real IPs) ─────────
app.set("trust proxy", 1);

// ─── Helmet: security headers, tuned for Render deployment ───────────────────
app.use(
  helmet({
    // Allow images served from Cloudinary and our own origin
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // CSP managed at the CDN/static layer
  })
);

// ─── CORS: whitelist only our known frontend origins ─────────────────────────
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://architecture-website-sjh4.onrender.com",  // production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: { success: false, message: "Too many requests. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const subscribeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { message: "Too many subscriptions. Try later." },
});

// ─── DB ───────────────────────────────────────────────────────────────────────
connectDB();

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/contact",   contactLimiter,   contactRoutes);
app.use("/api/subscribe", subscribeLimiter, subscriberRoutes);
app.use("/api/admin",  adminRoutes);
app.use("/api/blogs",  blogRoutes);
app.use("/api/auth",   authRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
