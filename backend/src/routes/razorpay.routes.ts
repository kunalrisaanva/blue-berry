import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  getMyOrders,
} from "../controllers/razorpay.controller";
import passport from "../middleware/passport.middleware";
const router = Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

router.use(passport.authenticate("jwt", { session: false }));

router.get("/my-orders", getMyOrders);

export { router as razorpayRoutes };
