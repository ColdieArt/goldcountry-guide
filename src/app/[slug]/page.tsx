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
  getActiveCitySlugs,
} from "@/data/contractors";
import { getAverageRating, getReviewCount } from "@/data/reviews";
import { getCostGuidesByTrade } from "@/data/cost-guides";
import { costGuides } from "@/data/cost-guides";
import { getProjectsByCity, getProjectsByTrade } from "@/data/projects";
import GoldCountryMapWrapper from "@/components/GoldCountryMapWrapper";
import TradeCityPicker from "@/components/TradeCityPicker";

export function generateStaticParams() {
  return [
    ...getAllCitySlugs().map((slug) => ({ slug })),
    ...getAllTradeSlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (city) {
    return {
      title: `Home Services in ${city.name}, CA — Find Local Contractors`,
      description: `Find trusted, licensed contractors in ${city.name}, ${city.county} County, California. Browse electricians, plumbers, roofers, HVAC, and more. Read reviews and request free quotes.`,
    };
  }
  const trade = getTradeBySlug(slug);
  if (trade) {
    return {
      title: `${trade.namePlural} in Gold Country, CA — Licensed & Local`,
      description: `Find licensed ${trade.namePlural.toLowerCase()} serving Auburn, Grass Valley, Nevada City, and the Sierra foothills. ${trade.description} Compare reviews and get quotes.`,
    };
  }
  return {};
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (city) return <CityPage citySlug={city.slug} />;

  const trade = getTradeBySlug(slug);
  if (trade) return <TradePage tradeSlug={trade.slug} />;

  notFound();
}

/* ────────────────────────────────────────────────────────────────── */
/*  City Page — e.g. /auburn                                         */
/* ────────────────────────────────────────────────────────────────── */

function CityPage({ citySlug }: { citySlug: string }) {
  const city = getCityBySlug(citySlug)!;
  const allContractors = getContractorsByCity(city.slug);
  const featuredContractors = allContractors.filter(
    (c) => c.membershipStatus === "featured" || c.membershipStatus === "premium"
  );
  const projects = getProjectsByCity(city.slug);
  const nearbyCities = cities.filter(
    (c) => c.county === city.county && c.slug !== city.slug
  );

  // Collect cost guides for trades that have contractors in this city
  const activeTradeSlugs = new Set(allContractors.map((c) => c.tradeSlug));
  const relevantGuides = costGuides.filter((g) =>
    activeTradeSlugs.has(g.tradeSlug)
  );

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16">
        <div className="mx-auto flex max-w-6xl items-stretch gap-6">
          <div className="flex flex-1 flex-col justify-center text-center">
            <nav className="flex items-center justify-center gap-1 text-sm text-gray-700/60">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span>/</span>
              <span>{city.name}</span>
            </nav>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-gray-700/60">
              {city.county} County, California
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Home Services in {city.name}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-800/70">
              {city.description}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-700/60">
              <span>{allContractors.length} active contractor{allContractors.length !== 1 && "s"}</span>
              <span className="text-gray-300">|</span>
              <span>{trades.length} service categories</span>
            </div>
          </div>
          <div className="hidden w-[30%] flex-shrink-0 lg:block">
            <GoldCountryMapWrapper focusCitySlug={city.slug} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* ── Browse by Trade ───────────────────────────────────────── */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Find a Contractor in {city.name}
          </h2>
          <p className="mt-2 text-gray-700/70">
            Browse by trade to see who&apos;s available in your area.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trades.map((trade) => {
              const tradeContractors = getContractorsByTradeAndCity(
                trade.slug,
                city.slug
              );
              const count = tradeContractors.length;
              return (
                <Link
                  key={trade.slug}
                  href={`/${trade.slug}/${city.slug}`}
                  className="group rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {trade.namePlural}
                    </h3>
                    {count > 0 ? (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {count}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Coming soon</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-700/60">
                    {trade.description}
                  </p>
                  {count > 0 && (
                    <p className="mt-2 text-xs font-medium text-gray-600 opacity-0 transition-opacity group-hover:opacity-100">
                      View {count} {trade.namePlural.toLowerCase()} &rarr;
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Featured / Premium Contractors ────────────────────────── */}
        {featuredContractors.length > 0 && (
          <section className="border-t border-gray-100 py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Top-Rated Contractors in {city.name}
            </h2>
            <p className="mt-2 text-gray-700/70">
              Trusted professionals serving the {city.name} area.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {featuredContractors.map((c) => {
                const trade = getTradeBySlug(c.tradeSlug);
                const avg = getAverageRating(c.slug);
                const reviewCount = getReviewCount(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.tradeSlug}/${c.slug}`}
                    className="rounded-lg border border-gray-300 bg-gray-50/50 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {c.name}
                      </h3>
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium capitalize text-gray-800">
                        {c.membershipStatus}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700/60">
                      {trade?.namePlural}
                    </p>
                    <p className="mt-1 text-sm text-gray-700/70">
                      {c.specialties.join(" · ")}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-sm text-gray-700/60">
                      {avg !== null && (
                        <span>
                          {"★".repeat(Math.round(avg))}
                          {"☆".repeat(5 - Math.round(avg))}{" "}
                          <span className="text-xs">
                            ({reviewCount})
                          </span>
                        </span>
                      )}
                      {c.licensed && (
                        <span className="text-xs font-medium text-gray-700">
                          Licensed
                        </span>
                      )}
                      <span>{c.yearsInBusiness} yrs exp.</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── All Contractors ───────────────────────────────────────── */}
        {allContractors.length > 0 && (
          <section className="border-t border-gray-100 py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              All Contractors Serving {city.name}
            </h2>
            <div className="mt-6 space-y-3">
              {allContractors.map((c) => {
                const trade = getTradeBySlug(c.tradeSlug);
                const avg = getAverageRating(c.slug);
                const reviewCount = getReviewCount(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.tradeSlug}/${c.slug}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {c.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-700/60">
                        {trade?.namePlural}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700/60">
                      {avg !== null && (
                        <span>
                          {avg} ★ ({reviewCount})
                        </span>
                      )}
                      {c.licensed && (
                        <span className="text-xs font-medium text-gray-700">
                          Licensed
                        </span>
                      )}
                      <span className="hidden sm:inline">
                        {c.yearsInBusiness} yrs
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Cost Guides ───────────────────────────────────────────── */}
        {relevantGuides.length > 0 && (
          <section className="border-t border-gray-100 py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              How Much Does It Cost in {city.name}?
            </h2>
            <p className="mt-2 text-gray-700/70">
              Budget estimates based on local projects in the Gold Country area.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relevantGuides.map((g) => {
                const trade = getTradeBySlug(g.tradeSlug);
                return (
                  <Link
                    key={g.slug}
                    href={`/cost/${g.slug}`}
                    className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {g.title}
                    </h3>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      ${g.lowEstimate.toLocaleString()} &ndash; $
                      {g.highEstimate.toLocaleString()}
                    </p>
                    {trade && (
                      <p className="mt-1 text-sm text-gray-700/60">
                        See {trade.namePlural.toLowerCase()} in{" "}
                        {city.name} &rarr;
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Recent Projects ───────────────────────────────────────── */}
        {projects.length > 0 && (
          <section className="border-t border-gray-100 py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Projects in {city.name}
            </h2>
            <p className="mt-2 text-gray-700/70">
              See what local homeowners are getting done.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {projects.map((p) => {
                const trade = getTradeBySlug(p.tradeSlug);
                const contractor = allContractors.find(
                  (c) => c.slug === p.contractorSlug
                );
                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-700/70 line-clamp-2">
                      {p.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-700/60">
                      {contractor?.name}
                      {trade && <> · {trade.namePlural}</>}
                      {" · "}
                      {p.completedDate}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="border-t border-gray-100 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to Start Your Project?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-gray-700/70">
            Browse available contractors in {city.name} and request quotes
            from licensed, local professionals.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {trades.slice(0, 4).map((trade) => (
              <Link
                key={trade.slug}
                href={`/${trade.slug}/${city.slug}`}
                className="rounded-lg bg-gray-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Find {trade.namePlural}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-700/50">
            Or browse{" "}
            <Link
              href="/"
              className="underline hover:text-gray-700"
            >
              all trades
            </Link>{" "}
            and{" "}
            <Link
              href="/"
              className="underline hover:text-gray-700"
            >
              all cities
            </Link>
          </p>
        </section>

        {/* ── Nearby Cities ─────────────────────────────────────────── */}
        {nearbyCities.length > 0 && (
          <section className="border-t border-gray-100 py-12">
            <h2 className="text-xl font-bold text-gray-900">
              Also in {city.county} County
            </h2>
            <p className="mt-2 text-sm text-gray-700/70">
              Many contractors in {city.name} also serve these nearby areas.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {nearbyCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
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
  const projects = getProjectsByTrade(trade.slug);

  // Aggregate unique specialties across all contractors in this trade
  const allSpecialties = Array.from(
    new Set(contractors.flatMap((c) => c.specialties))
  );

  // Build city data with embedded contractors for the picker
  const cityOptions = cities.map((city) => {
    const cityContractors = getContractorsByTradeAndCity(trade.slug, city.slug);
    return {
      slug: city.slug,
      name: city.name,
      county: city.county,
      contractorCount: cityContractors.length,
      contractors: cityContractors.map((c) => ({
        slug: c.slug,
        name: c.name,
        tradeSlug: c.tradeSlug,
        specialties: c.specialties,
        yearsInBusiness: c.yearsInBusiness,
        licensed: c.licensed,
        membershipStatus: c.membershipStatus,
        phone: c.phone,
        description: c.description,
        avgRating: getAverageRating(c.slug),
        reviewCount: getReviewCount(c.slug),
      })),
    };
  });

  const citiesWithContractors = cityOptions.filter((c) => c.contractorCount > 0);

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-12 text-center">
        <nav className="flex items-center justify-center gap-1 text-sm text-gray-700/60">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span>{trade.namePlural}</span>
        </nav>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {trade.namePlural} in Gold Country
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-800/70">
          {trade.description}
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-700/60">
          <span>
            {contractors.length} contractor{contractors.length !== 1 && "s"}
          </span>
          <span className="text-gray-300">|</span>
          <span>
            {citiesWithContractors.length} cities served
          </span>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* ── City Picker + Contractor Results ─────────────────────── */}
        <section className="py-10">
          <TradeCityPicker
            tradeSlug={trade.slug}
            tradeName={trade.name}
            tradeNamePlural={trade.namePlural}
            cities={cityOptions}
          />
        </section>

        {/* ── Common Services ───────────────────────────────────────── */}
        {allSpecialties.length > 0 && (
          <section className="border-t border-gray-100 py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Common {trade.name} Services
            </h2>
            <p className="mt-2 text-gray-700/70">
              Typical project types handled by {trade.namePlural.toLowerCase()} in the Gold Country area.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {allSpecialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Cost Guides ───────────────────────────────────────────── */}
        {guides.length > 0 && (
          <section className="border-t border-gray-100 py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              How Much Do {trade.name} Services Cost?
            </h2>
            <p className="mt-2 text-gray-700/70">
              Local pricing data to help you budget your next project.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/cost/${g.slug}`}
                  className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900">{g.title}</h3>
                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    ${g.lowEstimate.toLocaleString()} &ndash; $
                    {g.highEstimate.toLocaleString()}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {g.factors.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-gray-700/60"
                      >
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Recent Projects ───────────────────────────────────────── */}
        {projects.length > 0 && (
          <section className="border-t border-gray-100 py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent {trade.name} Projects
            </h2>
            <p className="mt-2 text-gray-700/70">
              See completed work from {trade.namePlural.toLowerCase()} in the area.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {projects.map((p) => {
                const pCity = getCityBySlug(p.citySlug);
                const pContractor = contractors.find(
                  (c) => c.slug === p.contractorSlug
                );
                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold text-gray-900">{p.title}</h3>
                    <p className="mt-1 text-sm text-gray-700/70 line-clamp-2">
                      {p.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-700/60">
                      {pContractor?.name}
                      {pCity && <> · {pCity.name}</>}
                      {" · "}
                      {p.completedDate}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="border-t border-gray-100 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Need a {trade.name}?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-gray-700/70">
            Request quotes from licensed, local {trade.namePlural.toLowerCase()} in the Gold Country area.
          </p>
          <Link
            href="/request"
            className="mt-6 inline-block rounded-lg bg-amber-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
          >
            Get Free Quotes
          </Link>
          <p className="mt-4 text-sm text-gray-700/50">
            Or browse{" "}
            <Link href="/" className="underline hover:text-gray-700">
              all trades
            </Link>{" "}
            and{" "}
            <Link href="/" className="underline hover:text-gray-700">
              all cities
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
