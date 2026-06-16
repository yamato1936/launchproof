import { randomUUID } from "crypto";
import { LaunchCheck, Project, Risk } from "@/lib/types";
import { isDatabaseUsed } from "@/lib/validation";

function createRisk(
  projectId: string,
  severity: Risk["severity"],
  category: Risk["category"],
  title: string,
  description: string,
  recommendation: string
): Risk {
  return {
    id: randomUUID(),
    projectId,
    severity,
    category,
    title,
    description,
    recommendation,
    createdAt: new Date().toISOString()
  };
}

export async function runLaunchCheck(
  project: Project,
  previousChecks: LaunchCheck[] = []
): Promise<{
  check: LaunchCheck;
  risks: Risk[];
}> {
  const startedAt = performance.now();
  const checkedAt = new Date().toISOString();
  const risks: Risk[] = [];

  let check: LaunchCheck;

  try {
    const response = await fetch(project.url, {
      cache: "no-store",
      redirect: "follow"
    });
    const latencyMs = Math.round(performance.now() - startedAt);

    check = {
      id: randomUUID(),
      projectId: project.id,
      url: project.url,
      status: response.ok ? "pass" : "fail",
      statusCode: response.status,
      latencyMs,
      checkedAt
    };

    if (!response.ok) {
      risks.push(
        createRisk(
          project.id,
          "high",
          "availability",
          "Application returned non-success status",
          `The application responded with HTTP ${response.status}, which indicates the deployed URL is not returning a successful response.`,
          "Investigate the deployment logs, routing configuration, and health endpoint until the target URL returns a 2xx status."
        )
      );
    }

    if (latencyMs > 1000) {
      risks.push(
        createRisk(
          project.id,
          "medium",
          "performance",
          "Slow response time",
          `The target URL responded in ${latencyMs}ms, which may feel slow for stakeholders and users.`,
          "Profile cold starts, server rendering, database calls, and asset delivery before launch."
        )
      );
    }
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startedAt);
    const message = error instanceof Error ? error.message : "Unknown network error";

    check = {
      id: randomUUID(),
      projectId: project.id,
      url: project.url,
      status: "fail",
      latencyMs,
      error: message,
      checkedAt
    };

    risks.push(
      createRisk(
        project.id,
        "high",
        "availability",
        "Application could not be reached",
        `LaunchProof could not connect to the target URL. Error: ${message}`,
        "Confirm the deployment is online, the URL is correct, and public traffic is allowed."
      )
    );
  }

  if (!isDatabaseUsed(project.databaseUsed)) {
    risks.push(
      createRisk(
        project.id,
        "high",
        "database",
        "Missing database evidence",
        "The project does not have a recognized production database selected.",
        "Select DynamoDB, Aurora PostgreSQL, or Aurora DSQL and document how application data is persisted."
      )
    );
  }

  const successfulChecks = [...previousChecks, check].filter(
    (item) => item.status === "pass"
  ).length;

  if (successfulChecks < 2) {
    risks.push(
      createRisk(
        project.id,
        "low",
        "operational",
        "Limited launch history",
        "This project has fewer than two successful recorded launch checks.",
        "Run multiple checks before production launch."
      )
    );
  }

  return { check, risks };
}
