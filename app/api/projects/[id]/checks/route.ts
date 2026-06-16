import { NextResponse } from "next/server";
import { runLaunchCheck } from "@/lib/checks";
import { db } from "@/lib/db";
import { buildLaunchReport } from "@/lib/reports";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const project = await db.getProject(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const previousChecks = await db.listChecks(project.id);
  const { check, risks } = await runLaunchCheck(project, previousChecks);

  await db.addCheck(check);
  for (const risk of risks) {
    await db.addRisk(risk);
  }

  const report = await buildLaunchReport(project);
  return NextResponse.json(report);
}
