import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { login } from "../api/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useLogin() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,

    onSuccess: (response) => {
      toast.success(`Welcome back, ${response.data.user.name}!`);
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to sign in."));
    },
  });
}
