import dotenv from "dotenv";
dotenv.config();   // MUST be first

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Now env is available
connectDB();

app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});