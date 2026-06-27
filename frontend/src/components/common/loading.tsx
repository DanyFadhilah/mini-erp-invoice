import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
}

export function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-10">
      <Loader2 className="animate-spin" size={20} />

      <span>{text}</span>
    </div>
  );
}
