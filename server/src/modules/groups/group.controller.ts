import type { Request, Response } from "express";

import { groupService } from "./group.service.js";
import {
  createGroupSchema,
  updateGroupSchema,
  joinGroupSchema,
  getGroupBalancesSchema,
  settleGroupBalanceSchema,
} from "./group.validation.js";

export const groupController = {
  async createGroup(req: Request, res: Response) {
    const data = createGroupSchema.parse(req.body);

    const group = await groupService.createGroup(req.user!.id, data);
    res.status(201).json({
      success: true,
      message: "Group created successfully.",
      data: group,
    });
  },

  async getUserGroups(req: Request, res: Response) {
    const groups = await groupService.getUserGroups(req.user!.id);

    res.status(200).json({
      success: true,
      message: "Groups fetched successfully.",
      data: groups,
    });
  },

  async getGroupById(req: Request, res: Response) {
    const group = await groupService.getGroupById(req.params.groupId as string, req.user!.id);

    res.status(200).json({
      success: true,
      message: "Group fetched successfully.",
      data: group,
    });
  },

  async updateGroup(req: Request, res: Response) {
    const data = updateGroupSchema.parse(req.body);

    const group = await groupService.updateGroup(req.params.groupId as string, req.user!.id, data);

    res.status(200).json({
      success: true,
      message: "Group updated successfully.",
      data: group,
    });
  },

  async deleteGroup(req: Request, res: Response) {
    await groupService.deleteGroup(req.params.groupId as string, req.user!.id);

    res.status(200).json({
      success: true,
      message: "Group deleted successfully.",
    });
  },
  async generateInviteLink(req: Request, res: Response) {
    const invite = await groupService.generateInviteLink(
      req.params.groupId as string,
      req.user!.id
    );

    res.status(201).json({
      success: true,
      message: "Invite link generated successfully.",
      data: invite,
    });
  },

  async joinGroup(req: Request, res: Response) {
    const { token } = joinGroupSchema.parse(req.body);

    const group = await groupService.joinGroup(token, req.user!.id);
    res.status(200).json({
      success: true,
      message: "Joined group successfully.",
      data: group,
    });
  },

  async getGroupBalances(req: Request, res: Response) {
    const { groupId } = getGroupBalancesSchema.parse(req.params);

    const balances = await groupService.getGroupBalances(req.user!.id, groupId);

    res.status(200).json({
      success: true,
      message: "Group balances fetched successfully.",
      data: balances,
    });
  },
  async settleGroupBalance(req: Request, res: Response) {
    const { groupId, userId } = settleGroupBalanceSchema.parse(req.params);

    const result = await groupService.settleGroupBalance(req.user!.id, userId, groupId);

    res.status(200).json({
      success: true,
      message: "Outstanding balances settled successfully.",
      data: result,
    });
  },
};
