import type { Group } from "../types/group";
import { GroupCard } from "./GroupCard";

interface GroupsGridProps {
  groups: Group[];
}

export const GroupsGrid = ({ groups }: GroupsGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};
