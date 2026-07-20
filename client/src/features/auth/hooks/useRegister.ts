import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { register } from "../api/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useRegister() {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: register,

    onSuccess: () => {
      toast.success("Account created successfully!");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to create account."));
    },
  });
}
