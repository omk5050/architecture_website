import Subscriber from "../models/Subscriber.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// SUBSCRIBE
export const subscribe = async (req, res) => {
  try {
    const { email, name, website } = req.body;

    // Honeypot anti-spam
    if (website) {
      return res.status(400).json({ message: "Spam detected" });
    }

    // Validation
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check existing
    let user = await Subscriber.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    if (!user) {
      user = await Subscriber.create({
        name,
        email,
        verificationToken: token,
      });
    } else {
      user.verificationToken = token;
      await user.save();
    }

    // Email link
    const verifyLink = `${process.env.BASE_URL}/api/subscribe/verify/${token}`;

    await sendEmail(
      email,
      "Verify your subscription",
      `
        <h2>Confirm your email</h2>
        <p>Click below to verify:</p>
        <a href="${verifyLink}" target="_blank">Verify Email</a>
      `
    );

    res.status(200).json({
      success: true,
      message: "Verification email sent",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY
export const verifySubscriber = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await Subscriber.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send("Email verified successfully ✔");

  } catch (err) {
    res.status(500).send("Server error");
  }
};

// GET VERIFIED SUBSCRIBERS
export const getSubscribers = async (req, res) => {
  try {
    const subs = await Subscriber.find({ isVerified: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subs.length, data: subs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error fetch subs" });
  }
};