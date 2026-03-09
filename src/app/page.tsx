import Link from "next/link";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-amber-900 sm:text-5xl">
          Find Trusted Contractors in Gold Country
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-amber-800/70">
          Connect with licensed, local professionals in Auburn and the Sierra
          foothills. Get quotes for your next home project.
        </p>
      </section>

      {/* Trades grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-amber-900">Browse by Trade</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => (
            <Link
              key={trade.slug}
              href={`/${trade.slug}`}
              className="rounded-lg border border-amber-200 p-5 transition-colors hover:border-amber-400 hover:bg-amber-50"
            >
              <h3 className="font-semibold text-amber-900">
                {trade.namePlural}
              </h3>
              <p className="mt-1 text-sm text-amber-700/70">
                {trade.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities grid */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold text-amber-900">Browse by City</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="rounded-lg border border-amber-200 p-5 transition-colors hover:border-amber-400 hover:bg-amber-50"
            >
              <h3 className="font-semibold text-amber-900">{city.name}</h3>
              <p className="mt-1 text-sm text-amber-700/70">
                {city.county} County
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
