import React from "react";
import Link from "next/link";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Jira Facade",
  subtitle = "Enterprise Workflows",
}) => {
  return (
    <header className="flex w-full items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center space-x-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white"
          aria-label="Logo"
        >
          JF
        </div>
        <div>
          <span className="block text-lg font-bold leading-tight text-slate-900 dark:text-white">
            {title}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <nav aria-label="Main Navigation" className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
        >
          Dashboard
        </Link>
        <a
          href="/api/health"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Health API
        </a>
      </nav>
    </header>
  );
};

export default Header;
