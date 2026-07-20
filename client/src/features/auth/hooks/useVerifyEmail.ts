import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { verifyEmail } from "../api/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useVerifyEmail() {
  return useMutation({
    mutationKey: ["verify-email"],
    mutationFn: verifyEmail,

    onSuccess: () => {
      toast.success("Email verified successfully.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to verify your email."));
    },
  });
}
