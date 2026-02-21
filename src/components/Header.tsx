import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddClick: () => void;
}

const Header = ({ onAddClick }: HeaderProps) => {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 neon-border border">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Sub<span className="text-primary">Tracker</span>
          </h1>
        </div>
        <Button onClick={onAddClick} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>
    </header>
  );
};

export default Header;
