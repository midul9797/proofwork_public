/** Provider-neutral sandbox client. Candidate code only ever sees these types. */

export interface SandboxFile {
  /** Relative to the sandbox work directory, or absolute. */
  path: string;
  content: string | Uint8Array;
}

export interface RunOptions {
  /** Directory to run in. Defaults to the sandbox work directory. */
  cwd?: string;
  env?: Record<string, string>;
  /** Kill the command after this long. Defaults to 5 minutes. */
  timeoutMs?: number;
  /** Called with each chunk of combined stdout and stderr as it arrives. */
  onOutput?: (chunk: string) => void;
}

export interface RunResult {
  exitCode: number;
  /** True when the command was stopped by `timeoutMs`; `exitCode` is 124. */
  timedOut: boolean;
  output: string;
}

export interface CreateSandboxOptions {
  /** Docker image to start from, e.g. the Playwright image. */
  image: string;
  cpu?: number;
  memoryGb?: number;
  diskGb?: number;
  /** Block all outbound network access. */
  blockNetwork?: boolean;
  /** Provider stops an idle sandbox after this many minutes. */
  autoStopMinutes?: number;
}

export interface Sandbox {
  readonly id: string;
  writeFiles(files: SandboxFile[]): Promise<void>;
  run(command: string, options?: RunOptions): Promise<RunResult>;
  destroy(): Promise<void>;
}

export interface SandboxProvider {
  create(options: CreateSandboxOptions): Promise<Sandbox>;
}
