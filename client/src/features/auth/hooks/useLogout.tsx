import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { logout as logoutApi } from "../api/authApi";
import { useAuthStore } from "@/stores/authStore";

import { clearAccessToken } from "@/lib/accessToken";
import { queryClient } from "@/lib/queryClient";

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutApi,

    onSettled: () => {
      clearAccessToken();
      logout();
      queryClient.clear();

      toast.success("Logged out successfully.");

      navigate("/login", {
        replace: true,
      });
    },
  });
}
