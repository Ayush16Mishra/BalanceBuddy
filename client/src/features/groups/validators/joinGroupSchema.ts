import { z } from "zod";

export const joinGroupSchema = z.object({
  token: z.string().trim().min(1, "Invite code is required."),
});

export type JoinGroupFormData = z.infer<typeof joinGroupSchema>;
