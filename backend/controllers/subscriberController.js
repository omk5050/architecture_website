import Subscriber from "../models/subscriber.js";

export const subscribe = async (req, res) => {
  try {
    const { name, email } = req.body;

    // 1. Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 2. Anti-spam honeypot
    if (req.body.website) {
      return res.status(400).json({ message: "Spam detected" });
    }

    // 3. Check duplicate
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    // 4. Save with metadata
    const newSub = await Subscriber.create({
      name,
      email,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: newSub
    });

  } catch (err) {
    console.error(err);

    // Handle duplicate key error (DB-level safety)
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    res.status(500).json({ message: "Server error" });
  }
};