import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createGroup } from "../api/groupsApi";
import type { Group } from "../types/group";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,

    onSuccess: (group) => {
      queryClient.setQueryData<Group[]>(["groups"], (old = []) => [group, ...old]);
    },
  });
};
