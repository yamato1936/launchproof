export type DatabaseUsed = "DynamoDB" | "Aurora PostgreSQL" | "Aurora DSQL";

export type Project = {
  id: string;
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  databaseUsed: DatabaseUsed;
  reportSlug: string;
  createdAt: string;
  updatedAt: string;
};

export type LaunchCheck = {
  id: string;
  projectId: string;
  url: string;
  status: "pass" | "fail";
  statusCode?: number;
  latencyMs?: number;
  error?: string;
  checkedAt: string;
};

export type Risk = {
  id: string;
  projectId: string;
  severity: "low" | "medium" | "high";
  category:
    | "availability"
    | "performance"
    | "database"
    | "evidence"
    | "operational";
  title: string;
  description: string;
  recommendation: string;
  createdAt: string;
};

export type LaunchReport = {
  project: Project;
  checks: LaunchCheck[];
  risks: Risk[];
  score: number;
  generatedAt: string;
};
