import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { forgotPassword } from "../api/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPassword,

    onSuccess: () => {
      toast.success("If an account exists, a password reset link has been sent.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to process your request."));
    },
  });
}
