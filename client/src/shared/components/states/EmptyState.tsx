import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
      <Inbox className="text-muted-foreground h-10 w-10" />

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
