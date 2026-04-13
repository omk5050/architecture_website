import Blog from "../models/Blog.js";
import { uploadToCloudinary } from "../utils/upload.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const blog = await Blog.create({
      title,
      content,
      category: category || "Architecture",
      status: status || "draft",
      image: imageUrl
    });

    res.status(201).json({ success: true, data: blog });

  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({ message: error.message, full: error });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: blogs
    });

  } catch (error) {
    console.error("GET BLOGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    let updateData = { title, content, category, status };

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      updateData.image = imageUrl;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, data: blog });

  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Blog deleted"
    });

  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};