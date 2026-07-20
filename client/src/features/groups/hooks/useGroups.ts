import { useQuery } from "@tanstack/react-query";

import { getGroups } from "../api/groupsApi";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5,
  });
};
