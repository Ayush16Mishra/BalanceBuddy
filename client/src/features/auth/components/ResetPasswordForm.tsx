import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { resetPasswordSchema, type ResetPasswordFormData } from "../schemas/resetPasswordSchema";
import { useResetPassword } from "../hooks/useResetPassword";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const { mutateAsync, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      await mutateAsync({
        token,
        password: data.password,
      });

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Reset password failed:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>

        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          disabled={isPending}
          {...register("password")}
        />

        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>

        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          disabled={isPending}
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !token}>
        {isPending ? "Resetting Password..." : "Reset Password"}
      </Button>

      {!token && (
        <p className="text-center text-sm text-destructive">
          Invalid or missing password reset token.
        </p>
      )}
    </form>
  );
}
