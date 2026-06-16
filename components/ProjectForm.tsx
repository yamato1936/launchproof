"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { databaseOptions } from "@/lib/validation";

export function ProjectForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      url: String(formData.get("url") ?? ""),
      githubUrl: String(formData.get("githubUrl") ?? ""),
      databaseUsed: String(formData.get("databaseUsed") ?? "")
    };

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = (await response.json().catch(() => null)) as
      | { error?: string; project?: { id: string } }
      | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data?.error ?? "Unable to create project.");
      return;
    }

    form.reset();

    router.refresh();
  }

  return (
    <form className="card grid gap-4 p-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-bold text-slate-950">Create project</h2>
        <p className="mt-1 text-sm text-slate-600">
          Register a deployed app and its persistence choice.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field">
          <span className="label">Project name</span>
          <input className="input" name="name" required />
        </label>
        <label className="field">
          <span className="label">Target URL</span>
          <input className="input" name="url" type="url" required />
        </label>
      </div>
      <label className="field">
        <span className="label">Description</span>
        <textarea className="input min-h-24" name="description" required />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field">
          <span className="label">GitHub URL</span>
          <input className="input" name="githubUrl" type="url" />
        </label>
        <label className="field">
          <span className="label">Database used</span>
          <select className="input" name="databaseUsed" defaultValue="DynamoDB" required>
            {databaseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end">
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create project"}
        </button>
      </div>
    </form>
  );
}
