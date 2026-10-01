import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserWorkspace } from "@/lib/workspace";

/**
 * Local-only sign-in that skips email (avoids Supabase's email rate limit).
 * Disabled outside `next dev`, and only works when SUPABASE_SERVICE_ROLE_KEY is set.
 * Usage: /auth/dev-login?email=you@example.com
 */
export async function GET(request: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.NODE_ENV !== "development" || !serviceKey) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { origin, searchParams } = request.nextUrl;
  const email = searchParams.get("email");
  if (!email) return new NextResponse("Missing ?email=", { status: 400 });

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { persistSession: false },
  });
  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError) return new NextResponse(linkError.message, { status: 500 });

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: link.properties.hashed_token,
    type: "magiclink",
  });
  if (error || !data.user) {
    return new NextResponse(error?.message ?? "Sign-in failed", { status: 500 });
  }

  await ensureUserWorkspace(data.user);
  return NextResponse.redirect(`${origin}/dashboard`);
}
