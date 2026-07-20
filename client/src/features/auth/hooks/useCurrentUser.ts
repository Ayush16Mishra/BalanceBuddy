import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api/authApi";
import { useAuthStore } from "@/stores/authStore";

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data.data.user);
      setLoading(false);
    }
  }, [query.isSuccess, query.data, setUser, setLoading]);

  useEffect(() => {
    if (query.isError) {
      setUser(null);
      setLoading(false);
    }
  }, [query.isError, setUser, setLoading]);

  return query;
}
