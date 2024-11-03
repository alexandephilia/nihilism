import { Badge } from "./badge";

export interface StatusBadgeProps {
  status: "Working on" | string;
  icon: React.ReactNode;
  text: string;
}

export function StatusBadge({ status, icon, text }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "working on":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status.toLowerCase()) {
      case "working on":
        return "shadow-[0_0_12px_3px] shadow-yellow-500/50";
      case "completed":
        return "shadow-[0_0_12px_3px] shadow-green-500/50";
      default:
        return "shadow-[0_0_12px_3px] shadow-green-500/50";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-background to-muted hover:from-muted hover:to-background transition-all duration-500"
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`absolute inset-0 rounded-full ${getStatusGlow(status)} blur-[2px] animate-pulse`} />
          <div className={`relative w-2 h-2 rounded-full ${getStatusColor(status)} animate-pulse blur-[0.5px]`} />
        </div>
        <span className="text-sm font-medium">{status}</span>
      </div>
      <div className="flex items-center gap-1.5 pl-2 border-l border-muted-foreground/20">
        {icon}
        <span className="font-semibold">{text}</span>
      </div>
    </Badge>
  );
}