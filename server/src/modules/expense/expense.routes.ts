import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { expenseController } from "./expense.controller.js";

const router = Router();

router.post("/", authenticate, asyncHandler(expenseController.createExpense));
router.get("/:expenseId", authenticate, asyncHandler(expenseController.getExpenseDetails));
router.patch("/:expenseId/cancel", authenticate, asyncHandler(expenseController.cancelExpense));

export default router;
