import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isDatabaseUsed, isValidUrl } from "@/lib/validation";

export async function GET() {
  const projects = await db.listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    description?: unknown;
    url?: unknown;
    githubUrl?: unknown;
    databaseUsed?: unknown;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const url = typeof body.url === "string" ? body.url.trim() : "";
  const githubUrl =
    typeof body.githubUrl === "string" ? body.githubUrl.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }

  if (!description) {
    return NextResponse.json(
      { error: "Project description is required." },
      { status: 400 }
    );
  }

  if (!url || !isValidUrl(url)) {
    return NextResponse.json(
      { error: "A valid HTTP or HTTPS target URL is required." },
      { status: 400 }
    );
  }

  if (githubUrl && !isValidUrl(githubUrl)) {
    return NextResponse.json(
      { error: "GitHub URL must be a valid HTTP or HTTPS URL." },
      { status: 400 }
    );
  }

  if (!isDatabaseUsed(body.databaseUsed)) {
    return NextResponse.json(
      { error: "Database used must be DynamoDB, Aurora PostgreSQL, or Aurora DSQL." },
      { status: 400 }
    );
  }

  const project = await db.createProject({
    name,
    description,
    url,
    githubUrl: githubUrl || undefined,
    databaseUsed: body.databaseUsed
  });

  return NextResponse.json({ project }, { status: 201 });
}
