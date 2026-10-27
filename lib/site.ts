function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = siteUrl().replace(/\/$/, "");
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://proofwork-public.vercel.app").replace(/\/$/, "");
export const LOGIN_URL = `${APP_URL}/login`;

export const SITE_NAME = "Evaliro";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "moklasurrahman9797@gmail.com";
export const DEMO_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("An Evaliro demo")}&body=${encodeURIComponent("Hi Moklasur,\n\nI’d like to see Evaliro in action.\n\nMy team:\nThe role we’re hiring for:\n\nThanks!")}`;
export const CONTACT_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("A question about Evaliro")}`;

export const SITE_TITLE = "Evaliro — See how candidates solve real work with AI";
export const SITE_DESCRIPTION =
  "Generate AI-assisted candidate assessments around your role, with reviewed task materials and editable scoring. Review problem framing, AI collaboration, verification, domain judgment, and outcomes with evidence from the work.";
