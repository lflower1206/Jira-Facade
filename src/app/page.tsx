export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Jira Facade Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Enterprise facade layer and custom workflow enhancements for Jira Data Center.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Connected Backend
          </h2>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Jira Data Center</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-2">
            Online (Facade Mode)
          </span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Workflows
          </h2>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Custom Facade</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
            Ready
          </span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            EOL Migration Readiness
          </h2>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Prepared</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mt-2">
            Phase 1 Foundation
          </span>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Project Management Overview
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Welcome to Jira Facade. This interface provides an abstraction layer over Jira Data Center
          APIs, enabling tailored business workflows today and seamless platform transition in the
          future.
        </p>
      </section>
    </main>
  );
}
