
import { uploadToCloudinary } from "../utils/upload.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    let imageUrl = "";

    // If image uploaded → send to cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const blog = await Blog.create({
      title,
      content,
      image: imageUrl
    });

    res.status(201).json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    let updateData = { title, content };

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      updateData.image = imageUrl;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};