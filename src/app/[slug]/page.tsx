import { notFound } from "next/navigation";
import Link from "next/link";
import { getCityBySlug, getAllCitySlugs } from "@/data/cities";
import { getTradeBySlug, getAllTradeSlugs } from "@/data/trades";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";
import {
  getContractorsByCity,
  getContractorsByTrade,
  getContractorsByTradeAndCity,
} from "@/data/contractors";
import { getAverageRating, getReviewCount } from "@/data/reviews";
import { getCostGuidesByTrade } from "@/data/cost-guides";

export function generateStaticParams() {
  return [
    ...getAllCitySlugs().map((slug) => ({ slug })),
    ...getAllTradeSlugs().map((slug) => ({ slug })),
  ];
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);
  if (city) {
    return {
      title: `Home Services in ${city.name}, CA`,
      description: `Find trusted contractors in ${city.name}, ${city.county} County. Browse electricians, plumbers, roofers, and more.`,
    };
  }
  const trade = getTradeBySlug(params.slug);
  if (trade) {
    return {
      title: `${trade.namePlural} in Gold Country`,
      description: `Find licensed ${trade.namePlural.toLowerCase()} in Auburn, Grass Valley, Nevada City, and the Sierra foothills.`,
    };
  }
  return {};
}

export default function SlugPage({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);
  if (city) return <CityPage citySlug={city.slug} />;

  const trade = getTradeBySlug(params.slug);
  if (trade) return <TradePage tradeSlug={trade.slug} />;

  notFound();
}

/* ────────────────────────────────────────────────────────────────── */
/*  City Page — e.g. /auburn                                         */
/* ────────────────────────────────────────────────────────────────── */

function CityPage({ citySlug }: { citySlug: string }) {
  const city = getCityBySlug(citySlug)!;
  const contractors = getContractorsByCity(city.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-amber-900">
        Home Services in {city.name}, CA
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">{city.description}</p>

      {/* Browse by trade — with live contractor counts */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-amber-900">
          Find a Contractor in {city.name}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => {
            const count = getContractorsByTradeAndCity(trade.slug, city.slug).length;
            return (
              <Link
                key={trade.slug}
                href={`/${trade.slug}/${city.slug}`}
                className="rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
              >
                <span className="font-medium text-amber-900">
                  {trade.namePlural}
                </span>
                <span className="ml-2 text-sm text-amber-700/60">
                  {count > 0
                    ? `${count} listed`
                    : "Be the first"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All contractors serving this city */}
      {contractors.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-amber-900">
            Contractors Serving {city.name}
          </h2>
          <div className="mt-4 space-y-3">
            {contractors.map((c) => {
              const trade = getTradeBySlug(c.tradeSlug);
              const avg = getAverageRating(c.slug);
              const count = getReviewCount(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/${c.tradeSlug}/${c.slug}`}
                  className="block rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-amber-900">{c.name}</span>
                    <div className="flex items-center gap-2">
                      {c.membershipStatus !== "free" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 capitalize">
                          {c.membershipStatus}
                        </span>
                      )}
                      {c.licensed && (
                        <span className="text-xs font-medium text-green-700">
                          Licensed
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-amber-700/60">
                    {trade?.namePlural} · {c.yearsInBusiness} years
                    {avg !== null && (
                      <> · {avg} stars ({count})</>
                    )}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Cross-link to nearby cities in same county */}
      {cities.filter((c) => c.county === city.county && c.slug !== city.slug).length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-amber-900">
            Nearby in {city.county} County
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cities
              .filter((c) => c.county === city.county && c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-amber-200 px-4 py-1.5 text-sm text-amber-800 transition-colors hover:bg-amber-50"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Trade Page — e.g. /electricians                                   */
/* ────────────────────────────────────────────────────────────────── */

function TradePage({ tradeSlug }: { tradeSlug: string }) {
  const trade = getTradeBySlug(tradeSlug)!;
  const contractors = getContractorsByTrade(trade.slug);
  const guides = getCostGuidesByTrade(trade.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-amber-900">
        {trade.namePlural} in Gold Country
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">{trade.description}</p>

      {/* Trade + city grid */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-amber-900">
          {trade.namePlural} by City
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => {
            const count = getContractorsByTradeAndCity(trade.slug, city.slug).length;
            return (
              <Link
                key={city.slug}
                href={`/${trade.slug}/${city.slug}`}
                className="rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
              >
                <span className="font-medium text-amber-900">
                  {trade.namePlural} in {city.name}
                </span>
                <span className="ml-2 text-sm text-amber-700/60">
                  {count > 0 ? `(${count})` : ""}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All contractors in this trade */}
      {contractors.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-amber-900">
            All {trade.namePlural}
          </h2>
          <div className="mt-4 space-y-3">
            {contractors.map((c) => {
              const avg = getAverageRating(c.slug);
              const count = getReviewCount(c.slug);
              const cityNames = c.citySlugs
                .map((s) => getCityBySlug(s)?.name)
                .filter(Boolean)
                .join(", ");
              return (
                <Link
                  key={c.slug}
                  href={`/${trade.slug}/${c.slug}`}
                  className="block rounded-lg border border-amber-200 p-5 transition-colors hover:border-amber-400 hover:bg-amber-50"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold text-amber-900">
                      {c.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {c.membershipStatus !== "free" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 capitalize">
                          {c.membershipStatus}
                        </span>
                      )}
                      {c.licensed && (
                        <span className="text-xs font-medium text-green-700">
                          Licensed
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-amber-700/70">
                    {c.specialties.join(" · ")}
                  </p>
                  <p className="mt-2 text-sm text-amber-700/60">
                    {cityNames} · {c.yearsInBusiness} years
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

      {/* Cost guides for this trade */}
      {guides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-amber-900">Cost Guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/cost/${g.slug}`}
                className="rounded-lg border border-amber-200 p-5 transition-colors hover:border-amber-400 hover:bg-amber-50"
              >
                <h3 className="font-semibold text-amber-900">{g.title}</h3>
                <p className="mt-1 text-lg font-bold text-amber-800">
                  ${g.lowEstimate.toLocaleString()} &ndash; $
                  {g.highEstimate.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
