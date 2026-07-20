import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { dashboardController } from "./dashboard.controller.js";

const router = Router();

router.get("/", authenticate, asyncHandler(dashboardController.getDashboard));

export default router;
