import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
}

export function EmptyState({ title }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Inbox size={48} className="text-muted-foreground" />

      <p className="mt-4 text-muted-foreground">{title}</p>
    </div>
  );
}
