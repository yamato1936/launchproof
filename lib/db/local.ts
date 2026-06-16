import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { LaunchCheck, Project, Risk } from "@/lib/types";
import { CreateProjectInput, LaunchProofRepository } from "./repository";

type LocalStore = {
  projects: Project[];
  checks: LaunchCheck[];
  risks: Risk[];
};

const dataDirectory = path.join(process.cwd(), ".data");
const dataPath = path.join(dataDirectory, "launchproof.json");

const emptyStore = (): LocalStore => ({
  projects: [],
  checks: [],
  risks: []
});

async function ensureStoreFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(dataPath, "utf8");
  } catch {
    await writeFile(dataPath, JSON.stringify(emptyStore(), null, 2), "utf8");
  }
}

function normalizeStore(value: unknown): LocalStore {
  if (!value || typeof value !== "object") {
    return emptyStore();
  }

  const store = value as Partial<LocalStore>;

  return {
    projects: Array.isArray(store.projects) ? store.projects : [],
    checks: Array.isArray(store.checks) ? store.checks : [],
    risks: Array.isArray(store.risks) ? store.risks : []
  };
}

async function readStore(): Promise<LocalStore> {
  await ensureStoreFile();

  try {
    const raw = await readFile(dataPath, "utf8");
    if (!raw.trim()) {
      return emptyStore();
    }

    return normalizeStore(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: LocalStore) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataPath, JSON.stringify(store, null, 2), "utf8");
}

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "launch-report";
}

function uniqueReportSlug(name: string, projects: Project[]) {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;

  while (projects.some((project) => project.reportSlug === slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export const localRepository: LaunchProofRepository = {
  async createProject(input: CreateProjectInput) {
    const store = await readStore();
    const now = new Date().toISOString();
    const project: Project = {
      id: randomUUID(),
      name: input.name,
      description: input.description,
      url: input.url,
      githubUrl: input.githubUrl || undefined,
      databaseUsed: input.databaseUsed,
      reportSlug: uniqueReportSlug(input.name, store.projects),
      createdAt: now,
      updatedAt: now
    };

    store.projects.push(project);
    await writeStore(store);
    return project;
  },

  async listProjects() {
    const store = await readStore();
    return [...store.projects].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getProject(id: string) {
    const store = await readStore();
    return store.projects.find((project) => project.id === id) ?? null;
  },

  async getProjectByReportSlug(slug: string) {
    const store = await readStore();
    return store.projects.find((project) => project.reportSlug === slug) ?? null;
  },

  async addCheck(check: LaunchCheck) {
    const store = await readStore();
    store.checks.push(check);

    const project = store.projects.find((item) => item.id === check.projectId);
    if (project) {
      project.updatedAt = check.checkedAt;
    }

    await writeStore(store);
    return check;
  },

  async listChecks(projectId: string) {
    const store = await readStore();
    return store.checks
      .filter((check) => check.projectId === projectId)
      .sort((a, b) => b.checkedAt.localeCompare(a.checkedAt));
  },

  async addRisk(risk: Risk) {
    const store = await readStore();
    store.risks.push(risk);
    await writeStore(store);
    return risk;
  },

  async listRisks(projectId: string) {
    const store = await readStore();
    return store.risks
      .filter((risk) => risk.projectId === projectId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
};
