import Blog from "../models/Blog.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/upload.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    let imageUrl = "";
    let cloudinaryId = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);
      imageUrl = uploaded.url;
      cloudinaryId = uploaded.public_id;
    }

    const blog = await Blog.create({
      title,
      content,
      category: category || "Architecture",
      status: status || "draft",
      image: imageUrl,
      cloudinaryId
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
      // Delete the old Cloudinary image before uploading the new one
      const existing = await Blog.findById(req.params.id);
      if (existing?.cloudinaryId) {
        await deleteFromCloudinary(existing.cloudinaryId);
      }

      const uploaded = await uploadToCloudinary(req.file);
      updateData.image = uploaded.url;
      updateData.cloudinaryId = uploaded.public_id;
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
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Use stored cloudinaryId for a guaranteed-correct deletion.
    // Falls back to URL-parsing for any legacy posts that predate this fix.
    if (blog.cloudinaryId) {
      await deleteFromCloudinary(blog.cloudinaryId);
    } else if (blog.image) {
      const urlParts = blog.image.split('/');
      const lastSegment = urlParts.pop();
      const folderSegment = urlParts.pop();
      if (lastSegment && folderSegment) {
        const public_id = `${folderSegment}/${lastSegment.split('.')[0]}`;
        await deleteFromCloudinary(public_id);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Blog and image deleted"
    });

  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};