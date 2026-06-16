import { DatabaseUsed } from "@/lib/types";

export const databaseOptions = [
  "DynamoDB",
  "Aurora PostgreSQL",
  "Aurora DSQL"
] as const satisfies readonly DatabaseUsed[];

export function isDatabaseUsed(value: unknown): value is DatabaseUsed {
  return typeof value === "string" && databaseOptions.includes(value as DatabaseUsed);
}

export function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
