import Subscriber from "../models/subscriber.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // validation
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    const newSub = await Subscriber.create({ email });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: newSub
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};