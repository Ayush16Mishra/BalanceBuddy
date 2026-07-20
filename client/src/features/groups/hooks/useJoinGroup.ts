import { useMutation, useQueryClient } from "@tanstack/react-query";

import { joinGroup } from "../api/groupsApi";
import type { Group } from "../types/group";

export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinGroup,

    onSuccess: (group) => {
      queryClient.setQueryData<Group[]>(["groups"], (old = []) => [group, ...old]);
    },
  });
};
