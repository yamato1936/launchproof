import { db } from "@/lib/db";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectForm } from "@/components/ProjectForm";

export default async function DashboardPage() {
  const projects = await db.listProjects();
  const projectSummaries = await Promise.all(
    projects.map(async (project) => ({
      project,
      checks: await db.listChecks(project.id),
      risks: await db.listRisks(project.id)
    }))
  );

  return (
    <main className="container py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-slate-950">
            Project dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Create projects, review launch evidence, and open stakeholder-ready
            reports from one place.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
        <ProjectForm />
        <section className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Projects</h2>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-bold text-slate-700">
              {projects.length}
            </span>
          </div>

          {projectSummaries.length > 0 ? (
            projectSummaries.map(({ project, checks, risks }) => (
              <ProjectCard
                key={project.id}
                project={project}
                checks={checks}
                risks={risks}
              />
            ))
          ) : (
            <div className="card p-8 text-center">
              <h3 className="text-lg font-bold text-slate-950">No projects yet</h3>
              <p className="mt-2 text-slate-600">
                Create your first LaunchProof project to start collecting readiness
                evidence.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
