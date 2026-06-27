import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="w-full mb-4 flex flex-col items-start gap-3 justify-between lg:flex-row">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>

        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="self-end lg:self-center">{action}</div>
    </div>
  );
}
