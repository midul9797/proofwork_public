export default async function CandidateSessionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Your session</h1>
      <p className="mt-2 text-slate-600">
        Invite token: <code>{token}</code>
      </p>
    </main>
  );
}
