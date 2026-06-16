import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildLaunchReport } from "@/lib/reports";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const project = await db.getProjectByReportSlug(slug);

  if (!project) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const report = await buildLaunchReport(project);
  return NextResponse.json(report);
}
