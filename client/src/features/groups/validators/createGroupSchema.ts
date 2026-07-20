import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Group name must be at least 2 characters.")
    .max(100, "Group name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(255, "Description cannot exceed 255 characters.")
    .optional()
    .or(z.literal("")),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
