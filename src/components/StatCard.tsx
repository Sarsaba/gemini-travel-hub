import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: string;
  variant?: "default" | "primary" | "accent" | "success";
}

const variantStyles = {
  default: "glass-card",
  primary: "glass-card stat-glow border-primary/20",
  accent: "glass-card border-accent/20",
  success: "glass-card border-success/20",
};

const iconVariantStyles = {
  default: "bg-secondary text-muted-foreground",
  primary: "gradient-primary text-primary-foreground",
  accent: "gradient-accent text-accent-foreground",
  success: "bg-success/20 text-success",
};

const StatCard = ({ title, value, icon: Icon, subtitle, trend, variant = "default" }: StatCardProps) => {
  return (
    <div className={`${variantStyles[variant]} p-5 animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && <p className="text-xs text-success mt-1">{trend}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconVariantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
