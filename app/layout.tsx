import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchProof",
  description: "Turn AI-built prototypes into production-ready launch reports."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="container flex min-h-16 items-center justify-between gap-4">
            <Link href="/" className="text-lg font-bold tracking-normal text-slate-950">
              LaunchProof
            </Link>
            <nav className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/dashboard">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
