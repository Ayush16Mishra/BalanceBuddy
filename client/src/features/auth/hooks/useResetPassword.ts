import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resetPassword } from "../api/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useResetPassword() {
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, password),

    onSuccess: () => {
      toast.success("Your password has been reset successfully.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to reset your password."));
    },
  });
}
