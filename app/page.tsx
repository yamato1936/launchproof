import Link from "next/link";

const checks = [
  "Public URL availability",
  "HTTP status and reachability",
  "Response latency",
  "Database persistence evidence",
  "Operational launch history"
];

export default function LandingPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="container grid gap-8 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-normal text-teal-700">
              LaunchProof
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-slate-950 md:text-5xl">
              Turn AI-built prototypes into production-ready launch reports.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Register a project, run launch checks against a deployed URL, surface
              the practical risks, and share a readiness report that stakeholders can
              understand in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="button">
                Open dashboard
              </Link>
              <a href="#checks" className="button secondary">
                View checks
              </a>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-bold text-slate-500">Readiness score</p>
                <p className="text-5xl font-bold text-teal-700">86</p>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-800">
                Demo
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {checks.slice(0, 4).map((check) => (
                <div
                  key={check}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-slate-700">{check}</span>
                  <span className="font-bold text-teal-700">Tracked</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-5 py-12 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-slate-950">Problem</h2>
          <p className="mt-3 leading-7 text-slate-600">
            AI-assisted teams can produce impressive prototypes quickly, but launch
            conversations still need evidence: uptime, latency, data persistence,
            operational maturity, and a clear list of risks.
          </p>
        </div>
        <div id="checks" className="card p-6">
          <h2 className="text-xl font-bold text-slate-950">What LaunchProof checks</h2>
          <ul className="mt-4 grid gap-2 text-slate-700">
            {checks.map((check) => (
              <li key={check} className="rounded-md bg-slate-50 px-3 py-2">
                {check}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold text-slate-950">How it works</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Create a project, enter the deployed URL and database choice, run a
            launch check, then review the generated risks and readiness score.
            Every run is saved locally for repeatable evidence.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold text-slate-950">
            Why it matters for AI-built apps
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            The gap between a clever demo and a production launch is trust.
            LaunchProof gives builders a compact report they can share with judges,
            managers, investors, and technical reviewers.
          </p>
        </div>
      </section>
    </main>
  );
}
