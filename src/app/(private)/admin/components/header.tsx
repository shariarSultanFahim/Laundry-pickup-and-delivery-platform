"use client";

import { Card } from "@/components/ui";

const Header = ({
  title,
  subtitle,
  Button
}: {
  title: string;
  subtitle?: string;
  Button?: React.ReactNode;
}) => {
  return (
    <Card className="p-6 gap-2 flex-row items-center justify-between">
      <div className="gap-2 flex flex-col items-start justify-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {Button}
    </Card>
  );
};

export default Header;
