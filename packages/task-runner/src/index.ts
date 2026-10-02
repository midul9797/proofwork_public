export type {
  CreateSandboxOptions,
  RunOptions,
  RunResult,
  Sandbox,
  SandboxFile,
  SandboxProvider,
} from "./types";
export { DaytonaProvider } from "./daytona";

/** The Playwright image all tasks start from. Browsers live in /ms-playwright. */
export const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.63.0-noble";
