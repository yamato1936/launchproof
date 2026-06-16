import Link from "next/link";
import { LaunchCheck, Project, Risk } from "@/lib/types";
import { calculateReadinessScore } from "@/lib/score";
import { ReadinessScore } from "./ReadinessScore";

type ProjectCardProps = {
  project: Project;
  checks: LaunchCheck[];
  risks: Risk[];
};

export function ProjectCard({ project, checks, risks }: ProjectCardProps) {
  const score = calculateReadinessScore(checks, risks);

  return (
    <article className="card grid gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">{project.name}</h3>
          <p className="mt-2 leading-6 text-slate-600">{project.description}</p>
        </div>
        <ReadinessScore score={score} />
      </div>
      <dl className="grid gap-3 text-sm md:grid-cols-3">
        <div>
          <dt className="font-bold text-slate-500">Target URL</dt>
          <dd className="mt-1 break-all text-slate-800">{project.url}</dd>
        </div>
        <div>
          <dt className="font-bold text-slate-500">Database</dt>
          <dd className="mt-1 text-slate-800">{project.databaseUsed}</dd>
        </div>
        <div>
          <dt className="font-bold text-slate-500">Latest score</dt>
          <dd className="mt-1 text-slate-800">
            {checks.length > 0 ? `${score}/100` : "No checks yet"}
          </dd>
        </div>
      </dl>
      <div className="flex justify-end">
        <Link href={`/projects/${project.id}`} className="button secondary">
          View project
        </Link>
      </div>
    </article>
  );
}
