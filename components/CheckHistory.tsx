import { LaunchCheck } from "@/lib/types";

type CheckHistoryProps = {
  checks: LaunchCheck[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function CheckHistory({ checks }: CheckHistoryProps) {
  if (checks.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
        No launch checks have been recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">HTTP</th>
            <th className="px-4 py-3 font-bold">Latency</th>
            <th className="px-4 py-3 font-bold">Checked</th>
            <th className="px-4 py-3 font-bold">Error</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {checks.map((check) => (
            <tr key={check.id}>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                    check.status === "pass"
                      ? "bg-teal-100 text-teal-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {check.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-700">{check.statusCode ?? "N/A"}</td>
              <td className="px-4 py-3 text-slate-700">
                {typeof check.latencyMs === "number" ? `${check.latencyMs}ms` : "N/A"}
              </td>
              <td className="px-4 py-3 text-slate-700">{formatDate(check.checkedAt)}</td>
              <td className="max-w-xs px-4 py-3 text-slate-600">
                {check.error ?? "None"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
