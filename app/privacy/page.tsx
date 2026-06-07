import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Store Location Analyzer",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        Store Location Analyzer collects only the data necessary to provide site
        analysis features. When you use the map workspace, location coordinates
        and search queries may be sent to Google Maps APIs to generate scores.
      </p>
      <p>
        If you create an account, we store your email and saved analyses via our
        authentication provider. We do not sell personal data to third parties.
      </p>
      <p>
        For questions, contact us via the{" "}
        <Link href="/contact" className="text-brand-600 underline">
          contact page
        </Link>
        .
      </p>
    </LegalLayout>
  );
}

function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-slate-900">
            ← Store Location Analyzer
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <div className="prose prose-slate mt-8 space-y-4 text-slate-600">
          {children}
        </div>
      </main>
    </div>
  );
}
