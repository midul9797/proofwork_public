import { randomUUID } from "node:crypto";
import { Daytona, Image, type Sandbox as DaytonaSandbox } from "@daytona/sdk";
import type {
  CreateSandboxOptions,
  RunOptions,
  RunResult,
  Sandbox,
  SandboxFile,
  SandboxProvider,
} from "./types";

const DEFAULT_TIMEOUT_MS = 5 * 60_000;
const CREATE_TIMEOUT_SECONDS = 600;
const POLL_INTERVAL_MS = 250;
const RUN_DIR = "/tmp/proofwork-run";

const shellQuote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Daytona's own log stream adds 1 to 3 seconds at each end of a command, while a plain
 * `executeCommand` call returns in a few hundred milliseconds. So `run` starts the command in
 * the background, writing to a log file, and polls the file for new output and the exit code.
 */
class DaytonaSandboxClient implements Sandbox {
  readonly id: string;
  private workDir: Promise<string>;

  constructor(private readonly sandbox: DaytonaSandbox) {
    this.id = sandbox.id;
    this.workDir = sandbox.getWorkDir().then((dir) => dir ?? "/home/daytona");
  }

  private async resolvePath(path: string) {
    return path.startsWith("/") ? path : `${await this.workDir}/${path}`;
  }

  async writeFiles(files: SandboxFile[]): Promise<void> {
    if (files.length === 0) return;
    const uploads = await Promise.all(
      files.map(async (file) => ({
        source: Buffer.from(file.content),
        destination: await this.resolvePath(file.path),
      })),
    );
    await this.sandbox.fs.uploadFiles(uploads);
  }

  async run(command: string, options: RunOptions = {}): Promise<RunResult> {
    const { cwd, env = {}, timeoutMs = DEFAULT_TIMEOUT_MS, onOutput } = options;
    const exec = (script: string) =>
      this.sandbox.process.executeCommand(`bash -c ${shellQuote(script)}`);

    const id = randomUUID();
    const log = `${RUN_DIR}/${id}.log`;
    const exitFile = `${RUN_DIR}/${id}.exit`;
    const marker = `\u0001PWEXIT:${id}:`;
    const exports = Object.entries(env)
      .map(([key, value]) => `export ${key}=${shellQuote(value)}; `)
      .join("");
    const inner = `${exports}cd ${shellQuote(await this.resolvePath(cwd ?? "."))} && ${command}`;

    // Start detached, in its own process group so a timeout can kill the whole tree.
    // The exit code is written last, atomically, so seeing it means all output is on disk.
    const runner =
      `bash -c ${shellQuote(inner)} > ${log} 2>&1; ` +
      `echo $? > ${exitFile}.tmp; mv ${exitFile}.tmp ${exitFile}`;
    const started = await exec(
      `mkdir -p ${RUN_DIR} && : > ${log}; ` +
        `setsid bash -c ${shellQuote(runner)} < /dev/null > /dev/null 2>&1 & echo $!`,
    );
    const pid = started.result.trim();

    let output = "";
    let offset = 0;
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      // Read the exit file first: if it exists, everything the command wrote is already in the log.
      const poll = await exec(
        `E=$(cat ${exitFile} 2>/dev/null); tail -c +${offset + 1} ${log}; ` +
          `if [ -n "$E" ]; then printf '${marker}%s' "$E"; fi`,
      );
      let chunk = poll.result;
      let exitCode: number | undefined;
      const at = chunk.lastIndexOf(marker);
      if (at !== -1) {
        exitCode = Number(chunk.slice(at + marker.length).trim());
        chunk = chunk.slice(0, at);
      }
      if (chunk) {
        offset += Buffer.byteLength(chunk);
        output += chunk;
        onOutput?.(chunk);
      }
      if (exitCode !== undefined) {
        await exec(`rm -f ${log} ${exitFile}`).catch(() => undefined);
        return { exitCode, timedOut: false, output };
      }
      if (Date.now() >= deadline) {
        await exec(`kill -KILL -- -${pid} 2>/dev/null; rm -f ${log} ${exitFile}`).catch(
          () => undefined,
        );
        return { exitCode: 124, timedOut: true, output };
      }
      await sleep(POLL_INTERVAL_MS);
    }
  }

  async destroy(): Promise<void> {
    await this.sandbox.delete();
  }
}

export class DaytonaProvider implements SandboxProvider {
  private readonly client: Daytona;

  constructor(apiKey: string | undefined = process.env.DAYTONA_API_KEY) {
    if (!apiKey) throw new Error("DAYTONA_API_KEY is not set");
    this.client = new Daytona({ apiKey });
  }

  async create(options: CreateSandboxOptions): Promise<Sandbox> {
    const sandbox = await this.client.create(
      {
        image: Image.base(options.image),
        resources: {
          cpu: options.cpu ?? 2,
          memory: options.memoryGb ?? 4,
          disk: options.diskGb ?? 10,
        },
        autoStopInterval: options.autoStopMinutes ?? 15,
        ...(options.blockNetwork ? { networkBlockAll: true } : {}),
      },
      { timeout: CREATE_TIMEOUT_SECONDS },
    );
    return new DaytonaSandboxClient(sandbox);
  }
}
