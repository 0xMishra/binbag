import { Router } from "express";
import {
  getProfile,
  signin,
  signup,
  updateProfile,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/signup", signup);

router.post("/signin", signin);

router
  .route("/:id")
  .get(authMiddleware, getProfile)
  .put(authMiddleware, updateProfile);

export default router;
