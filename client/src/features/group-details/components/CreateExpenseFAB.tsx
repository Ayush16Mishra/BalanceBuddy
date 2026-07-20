import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CreateExpenseDialog } from "@/features/expenses/components/CreateExpenseDialog";
import type { Group } from "@/features/groups/types/group";

interface CreateExpenseFABProps {
  group: Group;
}

export const CreateExpenseFAB = ({ group }: CreateExpenseFABProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-24 right-4 rounded-full shadow-lg md:bottom-8 md:right-8"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-5 w-5" />
        Create Expense
      </Button>

      <CreateExpenseDialog group={group} open={open} onOpenChange={setOpen} />
    </>
  );
};
