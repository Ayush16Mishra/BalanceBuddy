import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must not exceed 100 characters.")
      .optional(),

    avatarUrl: z
      .string()
      .trim()
      .url("Avatar URL must be a valid URL.")
      .optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.avatarUrl !== undefined,
    {
      message: "At least one field must be provided.",
    }
  );

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
  })
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must be different from the current password.",
      path: ["newPassword"],
    }
  );

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;