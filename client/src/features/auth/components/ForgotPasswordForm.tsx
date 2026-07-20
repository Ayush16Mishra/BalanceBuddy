import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/auth/schemas/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await mutateAsync(data.email);
      setSubmitted(true);
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-7">
        <div className="rounded-lg border border-secondary bg-secondary/30 p-4 text-center">
          <p className="text-sm leading-6 text-muted">
            If an account exists with that email address, we've sent a password reset link. Please
            check your inbox.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            reset();
            setSubmitted(false);
          }}
          className="
            btn-primary
            shadow-primary
            transition-default
            h-11
            w-full
            rounded-lg
            text-base
            font-semibold
          "
        >
          Send Another Email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isPending}
          className="input-primary"
          {...register("email")}
        />

        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="
          btn-primary
          shadow-primary
          transition-default
          h-11
          w-full
          rounded-lg
          text-base
          font-semibold
        "
      >
        {isPending ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
