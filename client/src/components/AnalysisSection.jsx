import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const sectionConfig = {
  Strengths: {
    icon: CheckCircle2,
    badgeVariant: "success",
    iconClassName: "text-emerald-600",
    bulletClassName: "bg-emerald-500",
  },
  Gaps: {
    icon: AlertTriangle,
    badgeVariant: "destructive",
    iconClassName: "text-rose-600",
    bulletClassName: "bg-rose-500",
  },
  Suggestions: {
    icon: Lightbulb,
    badgeVariant: "default",
    iconClassName: "text-sky-600",
    bulletClassName: "bg-sky-500",
  },
};

function AnalysisSection({ title, items, emptyMessage }) {
  const config = sectionConfig[title];
  const Icon = config.icon;

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-2">
            <Icon className={`h-5 w-5 ${config.iconClassName}`} />
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <Badge variant={config.badgeVariant}>{items.length}</Badge>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={`${title}-${index}`}
                className="flex gap-3 text-sm text-slate-700"
              >
                <span
                  className={`mt-2 h-2 w-2 flex-none rounded-full ${config.bulletClassName}`}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default AnalysisSection;
