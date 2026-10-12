function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = siteUrl().replace(/\/$/, "");
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://proofwork-public.vercel.app").replace(/\/$/, "");
export const LOGIN_URL = `${APP_URL}/login`;

export const SITE_NAME = "Proofwork";
export const SITE_TITLE = "Proofwork: AI-allowed interview tasks for every role";
export const SITE_DESCRIPTION =
  "Hands-on interview tasks for every role that works with AI: product, analytics, sales, engineering and more. Proofwork plants mistakes in AI answers and shows who caught them.";
