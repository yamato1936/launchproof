import { Risk } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";

type RiskListProps = {
  risks: Risk[];
};

export function RiskList({ risks }: RiskListProps) {
  if (risks.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
        No risks have been detected yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {risks.map((risk) => (
        <article key={risk.id} className="card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <RiskBadge severity={risk.severity} />
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase text-slate-600">
              {risk.category}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-bold text-slate-950">{risk.title}</h3>
          <p className="mt-2 leading-7 text-slate-600">{risk.description}</p>
          <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            {risk.recommendation}
          </p>
        </article>
      ))}
    </div>
  );
}
