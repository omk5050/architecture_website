import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  const { title, content } = req.body;

  const blog = await Blog.create({
    title,
    content,
    image: req.file?.path // from multer
  });

  res.json(blog);
};

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};

export const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(blog);
};

export const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};