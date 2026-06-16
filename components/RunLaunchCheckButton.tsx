"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RunLaunchCheckButtonProps = {
  projectId: string;
};

export function RunLaunchCheckButton({ projectId }: RunLaunchCheckButtonProps) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runCheck() {
    setIsRunning(true);
    setError(null);

    const response = await fetch(`/api/projects/${projectId}/checks`, {
      method: "POST"
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    setIsRunning(false);

    if (!response.ok) {
      setError(data?.error ?? "Unable to run launch check.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid justify-items-start gap-2">
      <button className="button" type="button" onClick={runCheck} disabled={isRunning}>
        {isRunning ? "Running..." : "Run Launch Check"}
      </button>
      {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}
    </div>
  );
}
