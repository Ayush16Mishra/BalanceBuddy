import { useMutation } from "@tanstack/react-query";

import { generateInviteLink } from "../api/inviteApi";

export const useGenerateInvite = () => {
  return useMutation({
    mutationFn: generateInviteLink,
  });
};
