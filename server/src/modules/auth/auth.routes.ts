import { Router } from "express";
import passport from "passport";

import { authController } from "./auth.controller.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.get("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

/*
|--------------------------------------------------------------------------
| Google OAuth
|--------------------------------------------------------------------------
*/

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.GOOGLE_FAILURE_REDIRECT!,
  }),
  authController.googleCallback
);

export default router;
