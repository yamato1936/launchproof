import { LaunchCheck, Risk } from "@/lib/types";

export function calculateReadinessScore(checks: LaunchCheck[], risks: Risk[]): number {
  if (checks.length === 0) {
    return 0;
  }

  const failedCheckPenalty = checks.filter((check) => check.status === "fail").length * 20;
  const riskPenalty = risks.reduce((total, risk) => {
    if (risk.severity === "high") {
      return total + 20;
    }

    if (risk.severity === "medium") {
      return total + 10;
    }

    return total + 5;
  }, 0);

  return Math.max(0, Math.min(100, 100 - failedCheckPenalty - riskPenalty));
}
