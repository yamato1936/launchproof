import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckHistory } from "@/components/CheckHistory";
import { ReadinessScore } from "@/components/ReadinessScore";
import { RiskList } from "@/components/RiskList";
import { RunLaunchCheckButton } from "@/components/RunLaunchCheckButton";
import { db } from "@/lib/db";
import { buildLaunchReport } from "@/lib/reports";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await db.getProject(id);

  if (!project) {
    notFound();
  }

  const report = await buildLaunchReport(project);

  return (
    <main className="container py-10">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm font-bold text-teal-700">
          Back to dashboard
        </Link>
      </div>

      <section className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-normal text-slate-950">
              {project.name}
            </h1>
            <p className="mt-3 leading-7 text-slate-600">{project.description}</p>
          </div>
          <ReadinessScore score={report.score} />
        </div>

        <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 text-sm md:grid-cols-3">
          <div>
            <dt className="font-bold text-slate-500">Target URL</dt>
            <dd className="mt-1 break-all text-slate-800">{project.url}</dd>
          </div>
          <div>
            <dt className="font-bold text-slate-500">Database</dt>
            <dd className="mt-1 text-slate-800">{project.databaseUsed}</dd>
          </div>
          <div>
            <dt className="font-bold text-slate-500">Public report</dt>
            <dd className="mt-1">
              <Link
                href={`/reports/${project.reportSlug}`}
                className="font-bold text-teal-700"
              >
                Open report
              </Link>
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <RunLaunchCheckButton projectId={project.id} />
        </div>
      </section>

      <div className="mt-8 grid gap-8">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Launch checks</h2>
            <span className="text-sm font-bold text-slate-500">
              {report.checks.length} recorded
            </span>
          </div>
          <CheckHistory checks={report.checks} />
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Detected risks</h2>
            <span className="text-sm font-bold text-slate-500">
              {report.risks.length} found
            </span>
          </div>
          <RiskList risks={report.risks} />
        </section>
      </div>
    </main>
  );
}
