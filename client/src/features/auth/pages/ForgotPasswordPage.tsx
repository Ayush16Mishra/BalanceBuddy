import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <div className="page-background flex items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient" />

        <div className="bg-brand-glow absolute -left-72 -top-48 h-[850px] w-[850px] rounded-full blur-[220px]" />

        <div className="bg-brand-glow absolute -right-60 bottom-[-180px] h-[750px] w-[750px] rounded-full blur-[220px]" />

        <div className="bg-brand-glow-blue absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[260px]" />

        <div className="bg-brand-spotlight absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="heading-primary text-4xl">BalanceBuddy</h1>

          <p className="mt-3 text-lg text-muted">
            Reset your password to regain access to your account.
          </p>
        </div>

        <Card className="card-glass mx-auto w-full max-w-[460px] overflow-hidden">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-card-foreground">
              Forgot Password
            </CardTitle>

            <CardDescription className="mx-auto max-w-sm text-muted">
              Enter your email address and we'll send you a password reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ForgotPasswordForm />
          </CardContent>

          <CardFooter className="flex justify-center border-t border-secondary text-center text-sm">
            <Link to="/login" className="link-primary">
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
