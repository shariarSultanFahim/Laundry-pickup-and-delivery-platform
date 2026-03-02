import { Card } from "@/components/ui";

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <Card className="p-6 gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </Card>
  );
};

export default Header;
