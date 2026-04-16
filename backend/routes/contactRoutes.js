import express from "express";
import { submitContact, getContacts, deleteContact } from "../controllers/contactController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", protectAdmin, getContacts);
router.delete("/:id", protectAdmin, deleteContact);

export default router;