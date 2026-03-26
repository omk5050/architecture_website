import Contact from "../models/contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, company, budget, solution, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !solution || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      company,
      budget,
      solution,
      message
    });

    res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data: newContact
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};