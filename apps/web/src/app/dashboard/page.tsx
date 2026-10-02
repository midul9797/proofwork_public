import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listLatestTasks } from "@/lib/tasks";
import { ensureUserWorkspace } from "@/lib/workspace";
import { InviteForm } from "./invite-form";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  // The proxy already redirects signed-out visitors; this guards the type.
  if (!authUser) return null;
  const { user, workspace } = await ensureUserWorkspace(authUser);
  const tasks = await listLatestTasks();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{workspace.name}</h1>
          <p className="text-sm text-slate-600">
            {user.email} · {user.role}
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm">
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Invite a candidate</h2>
        <InviteForm
          tasks={tasks.map((task) => ({
            id: task.id,
            title: task.title,
            summary: task.summary,
            durationMinutes: task.durationMinutes,
            measures: task.measures,
          }))}
        />
      </section>
    </main>
  );
}
