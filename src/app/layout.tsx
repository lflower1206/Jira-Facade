import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jira Facade",
  description: "Enterprise project management facade for Jira Data Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-100">
        <Header />
        {children}
      </body>
    </html>
  );
}
