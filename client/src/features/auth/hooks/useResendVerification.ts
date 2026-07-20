import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resendVerification } from "../api/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useResendVerification() {
  return useMutation({
    mutationKey: ["resend-verification"],
    mutationFn: resendVerification,

    onSuccess: () => {
      toast.success(
        "If your account exists and is not yet verified, a new verification email has been sent."
      );
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to resend verification email."));
    },
  });
}
