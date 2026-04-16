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
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};