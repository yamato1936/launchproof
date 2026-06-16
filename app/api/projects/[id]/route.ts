import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildLaunchReport } from "@/lib/reports";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const project = await db.getProject(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const report = await buildLaunchReport(project);
  return NextResponse.json(report);
}
