import { Risk } from "@/lib/types";

type RiskBadgeProps = {
  severity: Risk["severity"];
};

export function RiskBadge({ severity }: RiskBadgeProps) {
  const className =
    severity === "high"
      ? "bg-rose-100 text-rose-800"
      : severity === "medium"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${className}`}>
      {severity}
    </span>
  );
}
