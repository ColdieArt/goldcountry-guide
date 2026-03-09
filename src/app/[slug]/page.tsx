import { notFound } from "next/navigation";
import Link from "next/link";
import { getCityBySlug, getAllCitySlugs } from "@/data/cities";
import { getTradeBySlug, getAllTradeSlugs } from "@/data/trades";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";
import {
  getContractorsByCity,
  getContractorsByTrade,
} from "@/data/contractors";

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

function CityPage({ citySlug }: { citySlug: string }) {
  const city = getCityBySlug(citySlug)!;
  const contractors = getContractorsByCity(city.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-amber-900">
        Home Services in {city.name}, CA
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">{city.description}</p>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-amber-900">
          Find a Contractor in {city.name}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => (
            <Link
              key={trade.slug}
              href={`/${trade.slug}/${city.slug}`}
              className="rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
            >
              <span className="font-medium text-amber-900">
                {trade.namePlural}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {contractors.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-amber-900">
            Featured Contractors in {city.name}
          </h2>
          <div className="mt-4 space-y-3">
            {contractors.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.tradeSlug}/${c.slug}`}
                className="block rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
              >
                <span className="font-medium text-amber-900">{c.name}</span>
                <span className="ml-2 text-sm text-amber-700/60">
                  {c.yearsInBusiness} years in business
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TradePage({ tradeSlug }: { tradeSlug: string }) {
  const trade = getTradeBySlug(tradeSlug)!;
  const contractors = getContractorsByTrade(trade.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-amber-900">
        {trade.namePlural} in Gold Country
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">{trade.description}</p>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-amber-900">
          {trade.namePlural} by City
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${trade.slug}/${city.slug}`}
              className="rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
            >
              <span className="font-medium text-amber-900">
                {trade.namePlural} in {city.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {contractors.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-amber-900">
            All {trade.namePlural}
          </h2>
          <div className="mt-4 space-y-3">
            {contractors.map((c) => (
              <Link
                key={c.slug}
                href={`/${trade.slug}/${c.slug}`}
                className="block rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
              >
                <span className="font-medium text-amber-900">{c.name}</span>
                <span className="ml-2 text-sm text-amber-700/60">
                  {c.citySlugs.join(", ")} &middot; {c.yearsInBusiness} years
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
