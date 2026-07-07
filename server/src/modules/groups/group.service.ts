import { groupRepository } from "./group.repository.js";
import { CreateGroupInput } from "./group.validation.js";
import { ApiError } from "../../utils/api-error.js";
import type { UpdateGroupInput } from "./group.validation.js";
import { expenseSharesService } from "../expense-shares/expense-shares.service.js";

export const groupService = {
  async createGroup(userId: string, data: CreateGroupInput) {
    return groupRepository.createGroup(userId, data);
  },

  async getUserGroups(userId: string) {
  return groupRepository.getUserGroups(userId);
},

async getGroupById(groupId: string, userId: string) {
  const group = await groupRepository.getGroupById(groupId, userId);

  if (!group) {
    throw new ApiError(404, "Group not found.");
  }

  return group;
},
async getGroupBalances(userId: string, groupId: string) {
  // Verify the user belongs to the group.
  await this.getGroupById(groupId, userId);

  return expenseSharesService.getOutstandingBalances(
    userId,
    groupId
  );
},
async updateGroup(
  groupId: string,
  userId: string,
  data: UpdateGroupInput
) {
  // Ensure the user belongs to the group.
  await this.getGroupById(groupId, userId);

  return groupRepository.updateGroup(groupId, data);
},


async deleteGroup(groupId: string, userId: string) {
  // Verify the user belongs to the group.
  await this.getGroupById(groupId, userId);

  await groupRepository.deleteGroup(groupId);
},

async generateInviteLink(groupId: string, userId: string) {
  await this.getGroupById(groupId, userId);

  const membershipLocked = await groupRepository.hasExpenses(groupId);

  if (membershipLocked) {
    throw new ApiError(
      409,
      "Group membership is locked after the first expense."
    );
  }

  let invite = await groupRepository.getActiveInvite(groupId);

  if (!invite) {
    invite = await groupRepository.createInvite(groupId);
  }

  return {
    token: invite.token,
    expiresAt: invite.expiresAt,
  };
},
async joinGroup(token: string, userId: string) {
  const invite = await groupRepository.getInviteByToken(token);

  if (!invite) {
    throw new ApiError(404, "Invalid invite link.");
  }

  if (invite.expiresAt < new Date()) {
    throw new ApiError(400, "Invite link has expired.");
  }

  const membershipLocked = await groupRepository.hasExpenses(invite.groupId);

  if (membershipLocked) {
    throw new ApiError(
      409,
      "Group membership is locked after the first expense."
    );
  }

  const existingMember = await groupRepository.isGroupMember(
    invite.groupId,
    userId
  );

  if (existingMember) {
    throw new ApiError(400, "You are already a member of this group.");
  }

  await groupRepository.addGroupMember(invite.groupId, userId);

  return groupRepository.getGroupById(invite.groupId, userId);
},

async settleGroupBalance(
  currentUserId: string,
  otherUserId: string,
  groupId: string
) {
  // Verify the current user belongs to the group.
  await this.getGroupById(groupId, currentUserId);

  return expenseSharesService.settleGroupBalance(
    currentUserId,
    otherUserId,
    groupId
  );
},

};