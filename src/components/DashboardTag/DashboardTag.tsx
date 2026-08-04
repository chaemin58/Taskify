import Colorchip from '@/assets/dashboard/ic-colorchips.svg';
import { cn } from '@/lib/cn';

interface DashboardTagProps {
  color: string,
  title: string;
  size?: number;
  className?: string;
}

export function DashboardTag({color, title, size = 36, className}: DashboardTagProps){
  return(
    <div className={cn("flex min-w-0 items-center gap-1", className)}>
      <Colorchip width={size} height={size} className="shrink-0" style={{ fill: color }}/>
      <span className="min-w-0 truncate">{title}</span>
    </div>
  )
}