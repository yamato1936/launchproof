import { LaunchCheck, Project, Risk } from "@/lib/types";

export type CreateProjectInput = {
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  databaseUsed: Project["databaseUsed"];
};

export interface LaunchProofRepository {
  createProject(input: CreateProjectInput): Promise<Project>;
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  getProjectByReportSlug(slug: string): Promise<Project | null>;

  addCheck(check: LaunchCheck): Promise<LaunchCheck>;
  listChecks(projectId: string): Promise<LaunchCheck[]>;

  addRisk(risk: Risk): Promise<Risk>;
  listRisks(projectId: string): Promise<Risk[]>;
}
