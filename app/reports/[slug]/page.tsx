import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckHistory } from "@/components/CheckHistory";
import { ReadinessScore } from "@/components/ReadinessScore";
import { RiskList } from "@/components/RiskList";
import { db } from "@/lib/db";
import { buildLaunchReport } from "@/lib/reports";

type ReportPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(value));
}

function summaryForScore(score: number) {
  if (score >= 80) {
    return "LaunchProof found a strong launch posture with limited immediate risk. Continue building evidence with repeated checks before a major production release.";
  }

  if (score >= 50) {
    return "LaunchProof found a workable prototype with issues that should be addressed before a confident production launch.";
  }

  return "LaunchProof found significant launch risk. Resolve availability, performance, database, or operational evidence gaps before sharing this app broadly.";
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const project = await db.getProjectByReportSlug(slug);

  if (!project) {
    notFound();
  }

  const report = await buildLaunchReport(project);

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200">
        <div className="container py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link href={`/projects/${project.id}`} className="text-sm font-bold text-teal-700">
              View project workspace
            </Link>
            <span className="text-sm font-semibold text-slate-500">
              Generated {formatDate(report.generatedAt)}
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-normal text-teal-700">
                Launch readiness report
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950">
                {project.name}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                {project.description}
              </p>
            </div>
            <ReadinessScore score={report.score} />
          </div>
        </div>
      </section>

      <section className="container grid gap-6 py-8 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm font-bold text-slate-500">Target URL</p>
          <p className="mt-2 break-all font-semibold text-slate-900">{project.url}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-bold text-slate-500">GitHub URL</p>
          <p className="mt-2 break-all font-semibold text-slate-900">
            {project.githubUrl ? project.githubUrl : "Not provided"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-bold text-slate-500">Database used</p>
          <p className="mt-2 font-semibold text-slate-900">{project.databaseUsed}</p>
        </div>
      </section>

      <section className="container pb-10">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-slate-950">LaunchProof summary</h2>
          <p className="mt-3 leading-7 text-slate-600">{summaryForScore(report.score)}</p>
        </div>
      </section>

      <section className="container grid gap-8 pb-12">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Check history</h2>
            <span className="text-sm font-bold text-slate-500">
              {report.checks.length} recorded
            </span>
          </div>
          <CheckHistory checks={report.checks} />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Risk list</h2>
            <span className="text-sm font-bold text-slate-500">
              {report.risks.length} found
            </span>
          </div>
          <RiskList risks={report.risks} />
        </div>
      </section>
    </main>
  );
}
