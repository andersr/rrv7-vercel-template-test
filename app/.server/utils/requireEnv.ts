import type { NodeEnv } from "~/types/env";

export function requireEnv() {
  const env = process.env.NODE_ENV as NodeEnv;
  if (!env) {
    throw new Error("no node env found");
  }
  return env;
}
