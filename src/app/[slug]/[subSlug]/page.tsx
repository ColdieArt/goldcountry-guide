import { notFound } from "next/navigation";
import Link from "next/link";
import { getTradeBySlug, getAllTradeSlugs } from "@/data/trades";
import { getCityBySlug, getAllCitySlugs } from "@/data/cities";
import { cities } from "@/data/cities";
import {
  getContractorBySlug,
  getContractorsByTrade,
  getContractorsByTradeAndCity,
  getAllCitySlugsForContractor,
  getActiveCitySlugs,
} from "@/data/contractors";
import { getReviewsByContractor, getAverageRating, getReviewCount } from "@/data/reviews";
import { getProjectsByContractor, getProjectsByCity } from "@/data/projects";
import { getCostGuidesByTrade } from "@/data/cost-guides";
import { trades } from "@/data/trades";
import QuickStart from "@/components/QuickStart";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  const params: { slug: string; subSlug: string }[] = [];
  for (const tradeSlug of getAllTradeSlugs()) {
    for (const citySlug of getAllCitySlugs()) {
      params.push({ slug: tradeSlug, subSlug: citySlug });
    }
    for (const c of getContractorsByTrade(tradeSlug)) {
      params.push({ slug: tradeSlug, subSlug: c.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const { slug, subSlug } = await params;
  const trade = getTradeBySlug(slug);
  if (!trade) return {};
  const city = getCityBySlug(subSlug);
  if (city) {
    return {
      title: `${trade.namePlural} in ${city.name}, CA - Licensed & Reviewed`,
      description: `Find licensed ${trade.namePlural.toLowerCase()} in ${city.name}, ${city.county} County, California. ${trade.description} Read reviews and request free quotes.`,
    };
  }
  const contractor = getContractorBySlug(subSlug);
  if (contractor && contractor.tradeSlug === trade.slug) {
    const cityNames = getAllCitySlugsForContractor(contractor)
      .map((s) => getCityBySlug(s)?.name)
      .filter(Boolean)
      .join(", ");
    return {
      title: `${contractor.name} - ${trade.name} in ${cityNames}, CA`,
      description: `${contractor.name} is a licensed ${trade.name.toLowerCase()} serving ${cityNames}. ${contractor.description.slice(0, 140)}`,
    };
  }
  return {};
}

export default async function SubSlugPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const { slug, subSlug } = await params;
  const trade = getTradeBySlug(slug);
  if (!trade) notFound();
  const city = getCityBySlug(subSlug);
  if (city) return <TradeCityPage tradeSlug={trade.slug} citySlug={city.slug} />;
  const contractor = getContractorBySlug(subSlug);
  if (contractor && contractor.tradeSlug === trade.slug) {
    return <ContractorProfilePage tradeSlug={trade.slug} contractorSlug={contractor.slug} />;
  }
  notFound();
}

/* ────────────────────────────────────────────────────────────────── */
/*  Trade + City — e.g. /electricians/auburn                         */
/* ────────────────────────────────────────────────────────────────── */

function TradeCityPage({ tradeSlug, citySlug }: { tradeSlug: string; citySlug: string }) {
  const trade = getTradeBySlug(tradeSlug)!;
  const city = getCityBySlug(citySlug)!;
  const contractors = getContractorsByTradeAndCity(trade.slug, city.slug);
  const guides = getCostGuidesByTrade(trade.slug);
  const projects = getProjectsByCity(city.slug).filter((p) => p.tradeSlug === trade.slug);

  const featured = contractors.filter((c) => c.membershipStatus === "featured");
  const premium = contractors.filter((c) => c.membershipStatus === "premium");
  const promoted = [...featured, ...premium];
  const standard = contractors.filter((c) => c.membershipStatus === "free");

  const allSpecialties = Array.from(new Set(contractors.flatMap((c) => c.specialties)));
  const allReviews = contractors.flatMap((c) =>
    getReviewsByContractor(c.slug).map((r) => ({ ...r, contractorName: c.name, contractorSlug: c.slug }))
  );
  allReviews.sort((a, b) => b.date.localeCompare(a.date));

  const tradeCityBreadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://goldcountry.guide/" },
      { "@type": "ListItem", position: 2, name: trade.namePlural, item: `https://goldcountry.guide/${trade.slug}` },
      { "@type": "ListItem", position: 3, name: city.name, item: `https://goldcountry.guide/${city.slug}` },
      { "@type": "ListItem", position: 4, name: `${trade.namePlural} in ${city.name}` },
    ],
  };

  return (
    <div className="bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <JsonLd data={tradeCityBreadcrumbLd} />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <span>/</span>
          <Link href={`/${trade.slug}`} className="transition-colors hover:text-white">{trade.namePlural}</Link>
          <span>/</span>
          <Link href={`/${city.slug}`} className="transition-colors hover:text-white">{city.name}</Link>
        </nav>

        {/* Hero */}
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-10 sm:px-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {trade.namePlural} in {city.name}, CA
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Find licensed {trade.namePlural.toLowerCase()} serving {city.name} and {city.county} County. Compare local professionals, read reviews, and request quotes.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-500">
            <span>{contractors.length} {contractors.length === 1 ? "contractor" : "contractors"} listed</span>
            {allReviews.length > 0 && <span>{allReviews.length} {allReviews.length === 1 ? "review" : "reviews"}</span>}
          </div>
        </div>

        {/* Common Services */}
        {allSpecialties.length > 0 && (
          <section className="mt-12">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Services</p>
            <h2 className="mt-2 text-xl font-bold text-white">
              Common {trade.name} Services in {city.name}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {allSpecialties.map((s) => (
                <span key={s} className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Quick Start */}
        <section className="mt-12">
          <QuickStart
            trade={trade.name}
            tradePlural={trade.namePlural}
            city={city.name}
            projectTypes={Array.from(new Set([...allSpecialties, ...guides.map((g) => g.title)]))}
          />
        </section>

        {/* Featured & Premium Contractors */}
        {promoted.length > 0 && (
          <section className="mt-12">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Top Rated</p>
            <h2 className="mt-2 text-xl font-bold text-white">
              Top {trade.namePlural} in {city.name}
            </h2>
            <div className="mt-6 space-y-4">
              {promoted.map((c) => {
                const avg = getAverageRating(c.slug);
                const count = getReviewCount(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={`/${trade.slug}/${c.slug}`}
                    className="group block rounded-2xl border border-amber-500/20 bg-neutral-900 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">{c.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-amber-400">{c.membershipStatus}</span>
                        {c.licensed && <span className="text-xs font-medium text-neutral-300">Licensed</span>}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-neutral-500">{c.specialties.join(" / ")}</p>
                    <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{c.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                      <span>{c.yearsInBusiness} yrs</span>
                      <span>{c.phone}</span>
                      {avg !== null && (
                        <span><span className="text-amber-400">{avg}</span> ({count} {count === 1 ? "review" : "reviews"})</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Cost Snapshot */}
        {guides.length > 0 && (
          <section className="mt-12">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Budget Planning</p>
            <h2 className="mt-2 text-xl font-bold text-white">{trade.name} Costs in {city.name}</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                    <th className="px-5 py-4">Project Type</th>
                    <th className="px-5 py-4 text-right">Typical Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {guides.map((g) => (
                    <tr key={g.slug} className="transition-colors hover:bg-neutral-900/50">
                      <td className="px-5 py-4">
                        <Link href={`/cost/${g.slug}`} className="font-medium text-white underline decoration-neutral-700 hover:decoration-amber-500">{g.title}</Link>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-amber-400">
                        ${g.lowEstimate.toLocaleString()} - ${g.highEstimate.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* All Contractors */}
        {standard.length > 0 && (
          <section className="mt-12">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">All Listings</p>
            <h2 className="mt-2 text-xl font-bold text-white">All {trade.namePlural} in {city.name}</h2>
            <div className="mt-6 space-y-3">
              {standard.map((c) => {
                const avg = getAverageRating(c.slug);
                const count = getReviewCount(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={`/${trade.slug}/${c.slug}`}
                    className="group block rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-amber-500/50"
                  >
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{c.name}</h3>
                      {c.licensed && <span className="text-xs font-medium text-neutral-300">Licensed</span>}
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">{c.specialties.join(" / ")}</p>
                    <p className="mt-2 text-sm text-neutral-500">
                      {c.yearsInBusiness} yrs / {c.phone}
                      {avg !== null && <> / <span className="text-amber-400">{avg}</span> ({count})</>}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {contractors.length === 0 && (
          <section className="mt-12">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center">
              <p className="text-neutral-300">No {trade.namePlural.toLowerCase()} listed in {city.name} yet.</p>
              <p className="mt-2 text-sm text-neutral-500">
                Are you a {trade.name.toLowerCase()} in {city.name}?{" "}
                <span className="font-medium text-amber-400">Contact us to get listed.</span>
              </p>
            </div>
          </section>
        )}

        {/* Reviews */}
        {allReviews.length > 0 && (
          <section className="mt-12">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Reviews</p>
            <h2 className="mt-2 text-xl font-bold text-white">Recent {trade.name} Reviews in {city.name}</h2>
            <div className="mt-6 space-y-4">
              {allReviews.slice(0, 4).map((r) => (
                <div key={r.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-white">{r.authorName}</span>
                    <span className="text-sm text-neutral-500">{r.date}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-amber-400">{"*".repeat(r.rating)}</span>
                    {r.projectType && <span className="ml-2 text-neutral-500">/ {r.projectType}</span>}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">{r.text}</p>
                  <Link href={`/${trade.slug}/${r.contractorSlug}`} className="mt-2 inline-block text-sm font-medium text-amber-400 hover:text-amber-300">
                    {r.contractorName}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mt-12">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Recent Work</p>
            <h2 className="mt-2 text-xl font-bold text-white">Recent {trade.name} Projects in {city.name}</h2>
            <div className="mt-6 space-y-3">
              {projects.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="group block rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-amber-500/50">
                  <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors">{p.title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">Completed {p.completedDate}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contractor CTA */}
        <section className="mt-12 rounded-2xl border border-amber-500/20 bg-neutral-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Are You a {trade.name} in {city.name}?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-400">
            Get listed on GoldCountry.guide and connect with homeowners looking for {trade.namePlural.toLowerCase()} in {city.name} and {city.county} County.
          </p>
          <p className="mt-4 text-sm font-semibold text-amber-400">Contact us to get started</p>
        </section>

        {/* Cross-links */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-white">Other Services in {city.name}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {trades.filter((t) => t.slug !== trade.slug).map((t) => (
              <Link key={t.slug} href={`/${t.slug}/${city.slug}`} className="rounded-xl border border-neutral-800 px-4 py-1.5 text-sm text-neutral-400 transition-all hover:border-amber-500/50 hover:text-white">
                {t.namePlural}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-white">{trade.namePlural} in Other Cities</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cities.filter((c) => c.slug !== city.slug).map((c) => (
              <Link key={c.slug} href={`/${trade.slug}/${c.slug}`} className="rounded-xl border border-neutral-800 px-4 py-1.5 text-sm text-neutral-400 transition-all hover:border-amber-500/50 hover:text-white">
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Contractor Profile — e.g. /electricians/jc-electrical             */
/* ────────────────────────────────────────────────────────────────── */

function ContractorProfilePage({ tradeSlug, contractorSlug }: { tradeSlug: string; contractorSlug: string }) {
  const trade = getTradeBySlug(tradeSlug)!;
  const contractor = getContractorBySlug(contractorSlug)!;
  const allCities = getAllCitySlugsForContractor(contractor).map((s) => getCityBySlug(s)).filter(Boolean);
  const activeCities = new Set(getActiveCitySlugs(contractor));
  const reviews = getReviewsByContractor(contractor.slug);
  const avg = getAverageRating(contractor.slug);
  const projects = getProjectsByContractor(contractor.slug);
  const guides = getCostGuidesByTrade(trade.slug);

  const isActive = contractor.active;
  const isPaid = isActive && contractor.membershipStatus !== "free";

  const primaryCity = getCityBySlug(contractor.primaryCitySlug);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: contractor.name,
    description: contractor.description,
    telephone: contractor.phone,
    ...(contractor.website && { url: contractor.website }),
    ...(primaryCity && {
      areaServed: allCities.map((c) => ({ "@type": "City", name: c!.name })),
      address: { "@type": "PostalAddress", addressLocality: primaryCity.name, addressRegion: "CA", addressCountry: "US" },
    }),
    ...(avg !== null && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: avg, reviewCount: reviews.length, bestRating: 5, worstRating: 1 },
    }),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://goldcountry.guide/" },
      { "@type": "ListItem", position: 2, name: trade.namePlural, item: `https://goldcountry.guide/${trade.slug}` },
      { "@type": "ListItem", position: 3, name: contractor.name },
    ],
  };

  return (
    <div className="bg-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <JsonLd data={[jsonLd, breadcrumbLd]} />

        {/* Inactive banner */}
        {!isActive && (
          <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-center">
            <p className="text-sm font-medium text-neutral-300">This listing is not currently active.</p>
            <p className="mt-1 text-sm text-neutral-500">
              Looking for {trade.namePlural.toLowerCase()}?{" "}
              <Link href={`/${trade.slug}`} className="font-medium text-amber-400 hover:text-amber-300">
                Browse active {trade.namePlural.toLowerCase()}
              </Link>
            </p>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <span>/</span>
          <Link href={`/${trade.slug}`} className="transition-colors hover:text-white">{trade.namePlural}</Link>
          <span>/</span>
          <span className="text-neutral-400">{contractor.name}</span>
        </nav>

        {/* Header */}
        <div className="mt-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{contractor.name}</h1>
            {isPaid && (
              <span className="mt-1 shrink-0 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-neutral-950 capitalize">
                {contractor.membershipStatus}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {contractor.licensed && (
              <span className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300">
                Licensed{contractor.licenseNumber && ` (${contractor.licenseNumber})`}
              </span>
            )}
            <span className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300">
              {contractor.yearsInBusiness} years in business
            </span>
            {avg !== null && (
              <span className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300">
                <span className="text-amber-400">{avg}</span> ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>

          <p className="mt-3 text-xs text-neutral-600">
            {trade.name} serving {allCities.map((c) => c!.name).join(", ")}, CA / Listed on GoldCountry.guide
          </p>
        </div>

        {/* CTA - Contact (paid only) */}
        {isPaid && (
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-neutral-900 p-6">
            <h2 className="font-semibold text-white">Contact {contractor.name}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`tel:${contractor.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
              >
                Call {contractor.phone}
              </a>
              {contractor.website && (
                <a
                  href={contractor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white"
                >
                  Visit Website
                </a>
              )}
            </div>
            <p className="mt-3 text-xs text-neutral-600">Mention GoldCountry.guide when you call</p>
          </div>
        )}

        {/* About */}
        <section className="mt-10">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">About</p>
          <p className="mt-3 leading-relaxed text-neutral-400">{contractor.description}</p>
        </section>

        {/* Specialties */}
        {isActive && contractor.specialties.length > 0 && (
          <section className="mt-10">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Specialties</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {contractor.specialties.map((s) => (
                <span key={s} className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300">{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* Service Areas */}
        {isActive && (
          <section className="mt-10">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Service Areas</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {allCities.map((city) => (
                <Link
                  key={city!.slug}
                  href={`/${trade.slug}/${city!.slug}`}
                  className={`rounded-xl border px-4 py-1.5 text-sm transition-colors ${
                    activeCities.has(city!.slug)
                      ? "border-neutral-700 text-neutral-300 hover:border-amber-500/50 hover:text-white"
                      : "border-dashed border-neutral-800 text-neutral-600"
                  }`}
                >
                  {city!.name}, CA
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Business Details */}
        <section className="mt-10">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Details</p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-800">
            <dl className="divide-y divide-neutral-800 text-sm">
              <div className="flex justify-between px-5 py-3.5">
                <dt className="font-medium text-neutral-300">Trade</dt>
                <dd><Link href={`/${trade.slug}`} className="text-amber-400 hover:text-amber-300">{trade.name}</Link></dd>
              </div>
              <div className="flex justify-between px-5 py-3.5">
                <dt className="font-medium text-neutral-300">Years in Business</dt>
                <dd className="text-neutral-400">{contractor.yearsInBusiness}</dd>
              </div>
              {contractor.licensed && (
                <div className="flex justify-between px-5 py-3.5">
                  <dt className="font-medium text-neutral-300">License</dt>
                  <dd className="text-neutral-400">{contractor.licenseNumber || "Licensed"}</dd>
                </div>
              )}
              {isActive && (
                <div className="flex justify-between px-5 py-3.5">
                  <dt className="font-medium text-neutral-300">Phone</dt>
                  <dd className="text-neutral-400">{contractor.phone}</dd>
                </div>
              )}
              {isActive && contractor.website && (
                <div className="flex justify-between px-5 py-3.5">
                  <dt className="font-medium text-neutral-300">Website</dt>
                  <dd>
                    {isPaid ? (
                      <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                        {contractor.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-neutral-600">Upgrade to show website</span>
                    )}
                  </dd>
                </div>
              )}
              <div className="flex justify-between px-5 py-3.5">
                <dt className="font-medium text-neutral-300">Listing</dt>
                <dd className="capitalize text-neutral-400">{isActive ? contractor.membershipStatus : "Inactive"}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Reviews */}
        {isActive && reviews.length > 0 && (
          <section className="mt-10">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Reviews ({reviews.length})</p>
            {avg !== null && <p className="mt-1 text-sm text-neutral-500">Average: {avg} out of 5</p>}
            <div className="mt-6 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-white">{r.authorName}</span>
                    <span className="text-sm text-neutral-500">{r.date}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-amber-400">{"*".repeat(r.rating)}</span>
                    {r.projectType && <span className="ml-2 text-neutral-500">/ {r.projectType}</span>}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Projects */}
        {isActive && projects.length > 0 && (
          <section className="mt-10">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Portfolio</p>
            <h2 className="mt-2 text-xl font-bold text-white">Completed Projects</h2>
            <div className="mt-6 space-y-3">
              {projects.map((p) => {
                const pCity = getCityBySlug(p.citySlug);
                return (
                  <Link key={p.slug} href={`/projects/${p.slug}`} className="group block rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-amber-500/50">
                    <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors">{p.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500">{pCity?.name} / Completed {p.completedDate}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Cost Guides */}
        {guides.length > 0 && (
          <section className="mt-10">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Cost Guides</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {guides.map((g) => (
                <Link key={g.slug} href={`/cost/${g.slug}`} className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-amber-500/50">
                  <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors">{g.title}</h3>
                  <p className="mt-1 text-sm font-bold text-amber-400">
                    ${g.lowEstimate.toLocaleString()} - ${g.highEstimate.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="mt-12 rounded-2xl border border-amber-500/20 bg-neutral-900 p-8 text-center">
          {isPaid ? (
            <>
              <h2 className="text-xl font-bold text-white">Ready to Get Started?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-neutral-400">
                Contact {contractor.name} today for a free estimate on your {trade.name.toLowerCase()} project.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <a
                  href={`tel:${contractor.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
                >
                  Call {contractor.phone}
                </a>
                {contractor.website && (
                  <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-xl border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white">
                    Visit Website
                  </a>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white">
                {isActive
                  ? `Looking for a ${trade.name} in ${allCities.map((c) => c!.name).join(" or ")}?`
                  : `Find Active ${trade.namePlural} in Gold Country`}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-neutral-400">
                Browse {trade.namePlural.toLowerCase()} on GoldCountry.guide to compare options and read reviews.
              </p>
              <Link
                href={`/${trade.slug}`}
                className="mt-4 inline-flex items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
              >
                Browse All {trade.namePlural}
              </Link>
            </>
          )}
        </section>

        {/* Cross-links */}
        {isActive && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-white">More {trade.namePlural} in Gold Country</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link key={c.slug} href={`/${trade.slug}/${c.slug}`} className="rounded-xl border border-neutral-800 px-4 py-1.5 text-sm text-neutral-400 transition-all hover:border-amber-500/50 hover:text-white">
                  {trade.namePlural} in {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
