import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { TaskConfig } from "@proofwork/shared";

// Row-level security is on for every table and there are no policies, so Supabase's public REST
// API (reachable with the publishable key) sees nothing. The app reads and writes through its
// own server-side database connection, which is not affected by RLS.

export const userRole = pgEnum("user_role", ["admin", "member"]);

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

export const users = pgTable("users", {
  // Same id as the Supabase auth user (set in task 1.4).
  id: uuid("id").primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  role: userRole("role").notNull().default("member"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

/**
 * One row per version of a task. `pnpm tasks:sync` adds a new version whenever the task's files
 * change, so a session always points at the exact content the candidate was given.
 */
export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    /** Counts up from 1 for each distinct content of this slug. */
    version: integer("version").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    measures: jsonb("measures").$type<string[]>().notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    /** The parsed task.yaml. */
    config: jsonb("config").$type<TaskConfig>().notNull(),
    /** Hash of everything in the task folder; sync compares it to decide if a new version is needed. */
    contentHash: text("content_hash").notNull(),
    /** Where the candidate-visible repo files are stored. */
    storagePrefix: text("storage_prefix").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("tasks_slug_version_idx").on(table.slug, table.version)],
).enableRLS();

export const invites = pgTable(
  "invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    candidateName: text("candidate_name").notNull(),
    candidateEmail: text("candidate_email").notNull(),
    /** SHA-256 of the random token in the candidate link. The token itself is never stored. */
    tokenHash: text("token_hash").notNull().unique(),
    /** The link stops working after this time (unless a session is already running). */
    deadline: timestamp("deadline", { withTimezone: true }).notNull(),
    emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("invites_workspace_idx").on(table.workspaceId)],
).enableRLS();

/**
 * A candidate's attempt. An invite has at most one session, so the link works once to start and
 * afterwards only reconnects to that same session. The invite's status (invited, started,
 * submitted, expired) is worked out from these timestamps and the invite's deadline.
 */
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  inviteId: uuid("invite_id")
    .notNull()
    .unique()
    .references(() => invites.id, { onDelete: "cascade" }),
  /** The task version the candidate received (copied from the invite when the session starts). */
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id),
  consentAcceptedAt: timestamp("consent_accepted_at", { withTimezone: true }).notNull(),
  /** Set by the server, never by the browser. */
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  sandboxId: text("sandbox_id"),
  /** Where the final copy of the candidate's files is stored after submit. */
  snapshotPath: text("snapshot_path"),
}).enableRLS();

export type Workspace = typeof workspaces.$inferSelect;
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Invite = typeof invites.$inferSelect;
export type Session = typeof sessions.$inferSelect;
