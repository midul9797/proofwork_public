import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserWorkspace } from "@/lib/workspace";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  // The proxy already redirects signed-out visitors; this guards the type.
  if (!authUser) return null;
  const { user, workspace } = await ensureUserWorkspace(authUser);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
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
      <p className="mt-8 text-slate-600">Tasks and invites will appear here.</p>
    </main>
  );
}
