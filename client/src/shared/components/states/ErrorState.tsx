import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again later.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
      <TriangleAlert className="text-destructive h-10 w-10" />

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  );
}
