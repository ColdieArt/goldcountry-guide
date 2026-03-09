export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-yellow-100 dark:from-zinc-900 dark:to-zinc-800">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-amber-900 dark:text-amber-400">
          Gold Country Guide
        </h1>
        <p className="max-w-lg text-xl text-amber-800/80 dark:text-amber-300/70">
          Your guide to California&apos;s historic Gold Country — trails, towns,
          and treasures worth discovering.
        </p>
        <div className="mt-4 rounded-full bg-amber-700 px-8 py-3 text-lg font-semibold text-white shadow-lg">
          Coming Soon
        </div>
        <p className="mt-8 text-sm text-amber-700/50 dark:text-amber-400/40">
          goldcountry.guide
        </p>
      </main>
    </div>
  );
}
