import express from "express";
import {
  subscribe,
  verifySubscriber
} from "../controllers/subscriberController.js";

const router = express.Router();

router.post("/", subscribe);
router.get("/verify/:token", verifySubscriber);

export default router;