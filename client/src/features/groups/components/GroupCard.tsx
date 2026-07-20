import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Group } from "../types/group";

interface GroupCardProps {
  group: Group;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/groups/${group.id}`)}
    >
      <CardHeader>
        <CardTitle className="truncate">{group.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">{group.description || "No description"}</p>
      </CardContent>
    </Card>
  );
};
