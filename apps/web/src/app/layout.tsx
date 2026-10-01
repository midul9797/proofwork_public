import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PRODUCT_NAME } from "@proofwork/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: PRODUCT_NAME,
  description: "See how candidates work with AI, not just what they ship.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
