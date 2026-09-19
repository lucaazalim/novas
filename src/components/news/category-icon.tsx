import {
  BriefcaseIcon,
  ClapperboardIcon,
  CpuIcon,
  FlaskConicalIcon,
  GlobeIcon,
  HeartPulseIcon,
  TrophyIcon,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

import type { CategoryKey } from "@/lib/news/constants";

const ICONS: Record<CategoryKey, ComponentType<LucideProps>> = {
  general: GlobeIcon,
  business: BriefcaseIcon,
  technology: CpuIcon,
  science: FlaskConicalIcon,
  health: HeartPulseIcon,
  sports: TrophyIcon,
  entertainment: ClapperboardIcon,
};

export function CategoryIcon({ category, ...props }: LucideProps & { category: string }) {
  const Icon = ICONS[category as CategoryKey] ?? GlobeIcon;
  return <Icon aria-hidden="true" {...props} />;
}
