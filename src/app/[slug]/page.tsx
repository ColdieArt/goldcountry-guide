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
import TradeCityPicker from "@/components/TradeCityPicker";
import { getTradeCopy } from "@/data/trade-copy";

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
      title: `Home Services in ${city.name}, CA - Find Local Contractors`,
      description: `Find trusted, licensed contractors in ${city.name}, ${city.county} County, California. Browse electricians, plumbers, roofers, HVAC, and more. Read reviews and request free quotes.`,
    };
  }
  const trade = getTradeBySlug(slug);
  if (trade) {
    return {
      title: `${trade.namePlural} in Gold Country, CA - Licensed & Local`,
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
  const activeTradeSlugs = new Set(allContractors.map((c) => c.tradeSlug));
  const relevantGuides = costGuides.filter((g) =>
    activeTradeSlugs.has(g.tradeSlug)
  );

  return (
    <div className="bg-neutral-950">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <nav className="flex items-center justify-center gap-1.5 text-sm">
            <Link href="/" className="text-neutral-500 transition-colors hover:text-white">Home</Link>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-400">{city.name}</span>
          </nav>
          <p className="mt-6 text-sm font-medium uppercase tracking-widest text-amber-400">
            {city.county} County, California
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Home Services in {city.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">
            {city.description}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-neutral-500">
            <span>{allContractors.length} vetted contractor{allContractors.length !== 1 && "s"}</span>
            <span className="text-neutral-700">|</span>
            <span>{trades.length} service categories</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* ── Browse by Trade ───────────────────────────────────────── */}
        <section className="py-16">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Browse Services</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Find a Contractor in {city.name}
          </h2>
          <p className="mt-3 text-neutral-400">
            Browse by trade to see who&apos;s available in your area.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trades.map((trade) => {
              const count = getContractorsByTradeAndCity(trade.slug, city.slug).length;
              return (
                <Link
                  key={trade.slug}
                  href={`/${trade.slug}/${city.slug}`}
                  className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-white transition-colors group-hover:text-amber-400">
                      {trade.namePlural}
                    </h3>
                    {count > 0 ? (
                      <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                        {count}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-600">Coming soon</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {trade.description}
                  </p>
                  {count > 0 && (
                    <p className="mt-3 text-xs font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
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
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Featured</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Top-Rated Contractors in {city.name}
            </h2>
            <p className="mt-3 text-neutral-400">
              Trusted professionals serving the {city.name} area.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {featuredContractors.map((c) => {
                const trade = getTradeBySlug(c.tradeSlug);
                const avg = getAverageRating(c.slug);
                const reviewCount = getReviewCount(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.tradeSlug}/${c.slug}`}
                    className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white transition-colors group-hover:text-amber-400">
                        {c.name}
                      </h3>
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-amber-400">
                        {c.membershipStatus}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-neutral-500">
                      {trade?.namePlural}
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      {c.specialties.join(" · ")}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
                      {avg !== null && (
                        <span className="text-amber-400">
                          {"★".repeat(Math.round(avg))}
                          {"☆".repeat(5 - Math.round(avg))}{" "}
                          <span className="text-xs text-neutral-500">
                            ({reviewCount})
                          </span>
                        </span>
                      )}
                      {c.licensed && (
                        <span className="text-xs font-medium text-neutral-300">
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
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Full Directory</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              All Contractors Serving {city.name}
            </h2>
            <div className="mt-10 space-y-3">
              {allContractors.map((c) => {
                const trade = getTradeBySlug(c.tradeSlug);
                const avg = getAverageRating(c.slug);
                const reviewCount = getReviewCount(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.tradeSlug}/${c.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <div>
                      <span className="font-medium text-white">
                        {c.name}
                      </span>
                      <span className="ml-3 text-sm text-neutral-500">
                        {trade?.namePlural}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                      {avg !== null && (
                        <span>
                          <span className="text-amber-400">{avg} ★</span> ({reviewCount})
                        </span>
                      )}
                      {c.licensed && (
                        <span className="text-xs font-medium text-neutral-300">
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
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Cost Estimates</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              How Much Does It Cost in {city.name}?
            </h2>
            <p className="mt-3 text-neutral-400">
              Budget estimates based on local projects in the Gold Country area.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {relevantGuides.map((g) => {
                const trade = getTradeBySlug(g.tradeSlug);
                return (
                  <Link
                    key={g.slug}
                    href={`/cost/${g.slug}`}
                    className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <h3 className="font-semibold text-white transition-colors group-hover:text-amber-400">
                      {g.title}
                    </h3>
                    <p className="mt-3 text-2xl font-bold text-amber-400">
                      ${g.lowEstimate.toLocaleString()} &ndash; $
                      {g.highEstimate.toLocaleString()}
                    </p>
                    {trade && (
                      <p className="mt-3 text-sm text-neutral-500 transition-colors group-hover:text-neutral-400">
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
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Showcase</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Recent Projects in {city.name}
            </h2>
            <p className="mt-3 text-neutral-400">
              See what local homeowners are getting done.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {projects.map((p) => {
                const trade = getTradeBySlug(p.tradeSlug);
                const contractor = allContractors.find((c) => c.slug === p.contractorSlug);
                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <h3 className="font-semibold text-white transition-colors group-hover:text-amber-400">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400 line-clamp-2">
                      {p.description}
                    </p>
                    <p className="mt-3 text-sm text-neutral-500">
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
        <section className="relative border-t border-neutral-800 py-20 text-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[100px]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white">
              Ready to Start Your Project?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-400">
              Browse available contractors in {city.name} and request quotes
              from licensed, local professionals.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {trades.slice(0, 4).map((trade) => (
                <Link
                  key={trade.slug}
                  href={`/${trade.slug}/${city.slug}`}
                  className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
                >
                  Find {trade.namePlural}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm text-neutral-500">
              Or browse{" "}
              <Link
                href="/"
                className="text-neutral-400 underline underline-offset-2 transition-colors hover:text-white"
              >
                all trades
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="text-neutral-400 underline underline-offset-2 transition-colors hover:text-white"
              >
                all cities
              </Link>
            </p>
          </div>
        </section>

        {/* ── Nearby Cities ─────────────────────────────────────────── */}
        {nearbyCities.length > 0 && (
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Nearby</p>
            <h2 className="mt-2 text-xl font-bold text-white">
              Also in {city.county} County
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              Many contractors in {city.name} also serve these nearby areas.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {nearbyCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-neutral-800 bg-neutral-900 px-5 py-2 text-sm font-medium text-neutral-300 transition-all hover:border-amber-500/50 hover:text-white hover:shadow-lg hover:shadow-amber-500/5"
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

  const allSpecialties = Array.from(
    new Set(contractors.flatMap((c) => c.specialties))
  );

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
  const copy = getTradeCopy(trade.slug);

  return (
    <div className="bg-neutral-950">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="relative">
          <nav className="flex items-center justify-center gap-1.5 text-sm">
            <Link href="/" className="text-neutral-500 transition-colors hover:text-white">Home</Link>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-400">{trade.namePlural}</span>
          </nav>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {trade.namePlural} in Gold Country
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">
            {trade.description}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-neutral-500">
            <span>
              {contractors.length} contractor{contractors.length !== 1 && "s"}
            </span>
            <span className="text-neutral-700">|</span>
            <span>
              {citiesWithContractors.length} cities served
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* ── City Picker + Contractor Results ─────────────────────── */}
        <section className="py-12">
          <TradeCityPicker
            tradeSlug={trade.slug}
            tradeName={trade.name}
            tradeNamePlural={trade.namePlural}
            cities={cityOptions}
          />
        </section>

        {/* ── Why These Contractors ─────────────────────────────────── */}
        {copy && (
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Our Standard</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Why These {trade.namePlural}
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 leading-relaxed text-neutral-400">
              <p>{copy.vettedIntro}</p>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 sm:grid-cols-3">
              <div className="bg-neutral-900 p-8">
                <p className="font-semibold text-white">Trade-Vetted</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  Every contractor is recommended by other tradespeople who&apos;ve worked alongside them on real jobs.
                </p>
              </div>
              <div className="bg-neutral-900 p-8">
                <p className="font-semibold text-white">Small List, By Design</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  We keep the numbers low so you&apos;re choosing from the best, not sorting through the rest.
                </p>
              </div>
              <div className="bg-neutral-900 p-8">
                <p className="font-semibold text-white">Built by a Local</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  This site was created by a Gold Country homeowner who got tired of the guesswork and wants to make the process better for everyone.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Local Context ───────────────────────────────────────────── */}
        {copy && (
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Local Insight</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {trade.namePlural} in Gold Country - What You Should Know
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 leading-relaxed text-neutral-400">
              <p>{copy.localContext}</p>
            </div>

            <div className="mt-10">
              <h3 className="font-semibold text-white">
                What to Look for When Hiring
              </h3>
              <ul className="mt-5 space-y-3">
                {copy.whatToLookFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-neutral-400"
                  >
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-6">
              <p className="text-sm font-medium text-amber-400">On Cost</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{copy.costDisclaimer}</p>
            </div>
          </section>
        )}

        {/* ── Common Services ───────────────────────────────────────── */}
        {allSpecialties.length > 0 && (
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Services</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Common {trade.name} Services
            </h2>
            <p className="mt-3 text-neutral-400">
              Typical project types handled by {trade.namePlural.toLowerCase()} in the Gold Country area.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {allSpecialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-neutral-800 bg-neutral-900 px-5 py-2 text-sm font-medium text-neutral-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Cost Guides ───────────────────────────────────────────── */}
        {guides.length > 0 && (
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Pricing</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              How Much Do {trade.name} Services Cost?
            </h2>
            <p className="mt-3 text-neutral-400">
              Local pricing data to help you budget your next project.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/cost/${g.slug}`}
                  className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <h3 className="font-semibold text-white transition-colors group-hover:text-amber-400">{g.title}</h3>
                  <p className="mt-3 text-2xl font-bold text-amber-400">
                    ${g.lowEstimate.toLocaleString()} &ndash; $
                    {g.highEstimate.toLocaleString()}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {g.factors.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-neutral-500"
                      >
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600" />
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
          <section className="border-t border-neutral-800 py-16">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Showcase</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Recent {trade.name} Projects
            </h2>
            <p className="mt-3 text-neutral-400">
              See completed work from {trade.namePlural.toLowerCase()} in the area.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {projects.map((p) => {
                const pCity = getCityBySlug(p.citySlug);
                const pContractor = contractors.find((c) => c.slug === p.contractorSlug);
                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <h3 className="font-semibold text-white transition-colors group-hover:text-amber-400">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400 line-clamp-2">
                      {p.description}
                    </p>
                    <p className="mt-3 text-sm text-neutral-500">
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
        <section className="relative border-t border-neutral-800 py-20 text-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[100px]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white">
              Need a {trade.name}?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-400">
              Request quotes from licensed, local {trade.namePlural.toLowerCase()} in the Gold Country area.
            </p>
            <Link
              href="/request"
              className="mt-10 inline-block rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-neutral-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
            >
              Get Free Quotes
            </Link>
            <p className="mt-6 text-sm text-neutral-500">
              Or browse{" "}
              <Link href="/" className="text-neutral-400 underline underline-offset-2 transition-colors hover:text-white">
                all trades
              </Link>{" "}
              and{" "}
              <Link href="/" className="text-neutral-400 underline underline-offset-2 transition-colors hover:text-white">
                all cities
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
