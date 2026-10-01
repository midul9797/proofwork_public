import Link from "next/link";
import { PRODUCT_NAME } from "@proofwork/shared";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-4 px-6">
      <h1 className="text-4xl font-semibold tracking-tight">{PRODUCT_NAME}</h1>
      <p className="text-lg text-slate-600">
        Real engineering tasks, with AI allowed. See how candidates work, not just what they ship.
      </p>
      <Link href="/dashboard" className="rounded-md bg-slate-900 px-4 py-2 text-white">
        Hiring dashboard
      </Link>
    </main>
  );
}
