import Link from "next/link";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";
import { costGuides } from "@/data/cost-guides";
import { buildingOptions } from "@/data/building-options";
import { getFeaturedContractors } from "@/data/contractors";
import { getAverageRating, getReviewCount } from "@/data/reviews";
import GoldCountryMapWrapper from "@/components/GoldCountryMapWrapper";

export default function Home() {
  const featured = getFeaturedContractors();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20">
        <div className="mx-auto flex max-w-6xl items-stretch gap-6">
          <div className="flex flex-1 flex-col justify-center text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Find Trusted Contractors in Gold Country
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg font-medium text-yellow-700">
              Keep the money local.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-base text-gray-800/70">
              Hire licensed, local professionals who live and work in your community.
              Browse {trades.length} trades across {cities.length} foothill cities.
            </p>
          </div>
          <div className="hidden w-[30%] flex-shrink-0 lg:block">
            <GoldCountryMapWrapper />
          </div>
        </div>
      </section>

      {/* Building options callout */}
      <section className="mx-auto max-w-6xl px-4 -mt-6">
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-6 shadow-sm">
          <h2 className="text-center text-xl font-bold text-gray-900">
            What Are You Building?
          </h2>
          <p className="mt-1 text-center text-sm text-gray-700/70">
            Tell us about your project and we&apos;ll match you with the right trades.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {buildingOptions.map((option) => (
              <Link
                key={option.slug}
                href={`/${option.slug}`}
                className="rounded-lg border border-amber-200 bg-white p-4 text-center transition-colors hover:border-amber-400 hover:bg-amber-50"
              >
                <h3 className="font-semibold text-gray-900">{option.name}</h3>
                <p className="mt-1 text-xs text-gray-700/70">
                  {option.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured contractors */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Contractors
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => {
              const avg = getAverageRating(c.slug);
              const count = getReviewCount(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/${c.tradeSlug}/${c.slug}`}
                  className="rounded-lg border border-gray-300 bg-gray-50/50 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800">
                      Featured
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700/70">
                    {c.specialties.slice(0, 3).join(" · ")}
                  </p>
                  <p className="mt-2 text-sm text-gray-700/60">
                    {c.yearsInBusiness} years in business
                    {avg !== null && (
                      <> · {avg} stars ({count} {count === 1 ? "review" : "reviews"})</>
                    )}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Trades grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900">Browse by Trade</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => (
            <Link
              key={trade.slug}
              href={`/${trade.slug}`}
              className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">
                {trade.namePlural}
              </h3>
              <p className="mt-1 text-sm text-gray-700/70">
                {trade.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities grid */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900">Browse by City</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">{city.name}</h3>
              <p className="mt-1 text-sm text-gray-700/70">
                {city.county} County
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cost guides */}
      {costGuides.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-2xl font-bold text-gray-900">Cost Guides</h2>
          <p className="mt-2 text-gray-700/70">
            Plan your budget with local pricing data.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {costGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/cost/${guide.slug}`}
                className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                <p className="mt-1 text-lg font-bold text-gray-800">
                  ${guide.lowEstimate.toLocaleString()} &ndash; $
                  {guide.highEstimate.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
