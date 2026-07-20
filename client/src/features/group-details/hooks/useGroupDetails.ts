import { useQuery } from "@tanstack/react-query";

import { getGroupDetails } from "../api/groupDetailsApi";

export const useGroupDetails = (groupId: string) => {
  return useQuery({
    queryKey: ["group-details", groupId],
    queryFn: () => getGroupDetails(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });
};
