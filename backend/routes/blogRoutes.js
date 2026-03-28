import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

import {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";

const router = express.Router();

// Public
router.get("/", getBlogs);

// Admin protected
router.post("/", protectAdmin, upload.single("image"), createBlog);

router.put("/:id", protectAdmin, upload.single("image"), updateBlog);

router.delete("/:id", protectAdmin, deleteBlog);

export default router;