import { Router } from "express";
import { usersController } from "./users.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, usersController.getCurrentUser);
router.patch("/me", authenticate, usersController.updateProfile);
router.patch("/me/password", authenticate, usersController.changePassword);
router.delete("/me", authenticate, usersController.deleteAccount);

export default router;
