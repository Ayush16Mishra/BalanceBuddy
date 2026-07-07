import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .max(100, "Group name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .max(100, "Group name cannot exceed 100 characters.")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
});

export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;


export const joinGroupSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "Invite token is required."),
});

export type JoinGroupInput = z.infer<typeof joinGroupSchema>;

export const getGroupBalancesSchema = z.object({
  groupId: z.string().cuid("Invalid group ID."),
});

export type GetGroupBalancesInput = z.infer<
  typeof getGroupBalancesSchema
>;

export const settleGroupBalanceSchema = z.object({
  groupId: z.string().cuid("Invalid group ID."),
  userId: z.string().cuid("Invalid user ID."),
});

export type SettleGroupBalanceInput = z.infer<
  typeof settleGroupBalanceSchema
>;
