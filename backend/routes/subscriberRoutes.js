import express from "express";
import {
  subscribe,
  verifySubscriber,
  getSubscribers
} from "../controllers/subscriberController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", subscribe);
router.get("/verify/:token", verifySubscriber);
router.get("/", protectAdmin, getSubscribers);

export default router;