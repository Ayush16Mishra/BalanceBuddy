import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { expenseSharesController } from "./expense-shares.controller.js";

const router = Router();

router.get("/balances", authenticate, asyncHandler(expenseSharesController.getOutstandingBalances));

router.patch("/:shareId/pay", authenticate, asyncHandler(expenseSharesController.markSharePaid));

router.patch(
  "/groups/:groupId/users/:userId/settle",
  authenticate,
  asyncHandler(expenseSharesController.settleGroupBalance)
);

export default router;
