import { db } from "@/lib/db";
import { LaunchReport, Project } from "@/lib/types";
import { calculateReadinessScore } from "./score";

export async function buildLaunchReport(project: Project): Promise<LaunchReport> {
  const [checks, risks] = await Promise.all([
    db.listChecks(project.id),
    db.listRisks(project.id)
  ]);

  return {
    project,
    checks,
    risks,
    score: calculateReadinessScore(checks, risks),
    generatedAt: new Date().toISOString()
  };
}
