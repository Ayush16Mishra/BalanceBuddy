import type { Request, Response } from "express";
import { usersService } from "./users.service.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { updateProfileSchema } from "./users.validation.js";
import { changePasswordSchema } from "./users.validation.js";
import { deleteAccountSchema } from "./users.validation.js";
import { clearRefreshTokenCookie } from "../../utils/cookies.js";

export const usersController = {
  getCurrentUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.getCurrentUser(req.user!.id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: {
        user,
      },
    });
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
  const data = updateProfileSchema.parse(req.body);

  const user = await usersService.updateProfile(req.user!.id, data);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: {
      user,
    },
  });
}),

changePassword: asyncHandler(async (req: Request, res: Response) => {
  const data = changePasswordSchema.parse(req.body);

  await usersService.changePassword(
    req.user!.id,
    data.currentPassword,
    data.newPassword
  );

  return res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
}),


deleteAccount: asyncHandler(async (req: Request, res: Response) => {
  const data = deleteAccountSchema.parse(req.body);

  await usersService.deleteAccount(req.user!.id, data.password);

  clearRefreshTokenCookie(res);

  return res.status(200).json({
    success: true,
    message: "Account deleted successfully.",
  });
}),

};