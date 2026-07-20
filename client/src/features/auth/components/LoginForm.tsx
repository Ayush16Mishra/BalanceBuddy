import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "@/stores/authStore";
import { setAccessToken } from "@/lib/accessToken";

export function LoginForm() {
  const { mutateAsync, isPending } = useLogin();

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await mutateAsync(data);

      setAccessToken(response.data.accessToken);
      setUser(response.data.user);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
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
          className="input-primary"
          {...register("email")}
        />

        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-semibold text-foreground">
            Password
          </Label>

          <Link to="/forgot-password" className="link-primary text-sm font-medium">
            Forgot Password?
          </Link>
        </div>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          className="input-primary"
          {...register("password")}
        />

        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
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
        {isPending ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
