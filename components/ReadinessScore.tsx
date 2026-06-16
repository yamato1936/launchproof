type ReadinessScoreProps = {
  score: number;
};

function scoreLabel(score: number) {
  if (score >= 80) {
    return "Strong";
  }

  if (score >= 50) {
    return "Needs work";
  }

  return "At risk";
}

export function ReadinessScore({ score }: ReadinessScoreProps) {
  const tone =
    score >= 80
      ? "border-teal-200 bg-teal-50 text-teal-800"
      : score >= 50
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className={`inline-flex items-center gap-3 rounded-md border px-4 py-3 ${tone}`}>
      <span className="text-3xl font-bold">{score}</span>
      <span className="text-sm font-bold uppercase tracking-normal">
        {scoreLabel(score)}
      </span>
    </div>
  );
}
