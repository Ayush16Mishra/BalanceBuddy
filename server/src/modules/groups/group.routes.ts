import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { groupController } from "./group.controller.js";

const router = Router();

router.post("/",authenticate,asyncHandler(groupController.createGroup));
router.get("/",authenticate,asyncHandler(groupController.getUserGroups));
router.get("/:groupId",authenticate,asyncHandler(groupController.getGroupById));
router.patch("/:groupId",authenticate,asyncHandler(groupController.updateGroup));
router.delete("/:groupId",authenticate,asyncHandler(groupController.deleteGroup));
router.post("/:groupId/invite",authenticate,asyncHandler(groupController.generateInviteLink));
router.post("/join",authenticate,asyncHandler(groupController.joinGroup));
router.get("/:groupId/balances",authenticate,asyncHandler(groupController.getGroupBalances));
router.patch("/:groupId/settle/:userId",authenticate,asyncHandler(groupController.settleGroupBalance));

export default router;