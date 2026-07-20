import type { Group } from "../types/group";
import { GroupsGrid } from "./GroupsGrid";

interface ActiveGroupsProps {
  groups: Group[];
}

export const ActiveGroups = ({ groups }: ActiveGroupsProps) => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Active Groups</h2>

        <p className="text-muted-foreground text-sm">Groups you're currently a member of.</p>
      </div>

      <GroupsGrid groups={groups} />
    </section>
  );
};
