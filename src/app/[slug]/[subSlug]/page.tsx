import { notFound } from "next/navigation";
import Link from "next/link";
import { getTradeBySlug, getAllTradeSlugs } from "@/data/trades";
import { getCityBySlug, getAllCitySlugs } from "@/data/cities";
import { cities } from "@/data/cities";
import {
  getContractorBySlug,
  getContractorsByTrade,
  getContractorsByTradeAndCity,
} from "@/data/contractors";
import { getReviewsByContractor, getAverageRating, getReviewCount } from "@/data/reviews";
import { getProjectsByContractor, getProjectsByCity } from "@/data/projects";
import { getCostGuidesByTrade } from "@/data/cost-guides";
import { trades } from "@/data/trades";

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
      title: `${trade.namePlural} in ${city.name}, CA`,
      description: `Find licensed ${trade.namePlural.toLowerCase()} in ${city.name}, ${city.county} County. Get quotes from trusted local professionals.`,
    };
  }

  const contractor = getContractorBySlug(subSlug);
  if (contractor && contractor.tradeSlug === trade.slug) {
    const cityNames = contractor.citySlugs
      .map((s) => getCityBySlug(s)?.name)
      .filter(Boolean)
      .join(", ");
    return {
      title: `${contractor.name} — ${trade.name} in ${cityNames}`,
      description: contractor.description,
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
  if (city)
    return <TradeCityPage tradeSlug={trade.slug} citySlug={city.slug} />;

  const contractor = getContractorBySlug(subSlug);
  if (contractor && contractor.tradeSlug === trade.slug) {
    return (
      <ContractorProfilePage
        tradeSlug={trade.slug}
        contractorSlug={contractor.slug}
      />
    );
  }

  notFound();
}

/* ────────────────────────────────────────────────────────────────── */
/*  Trade + City — e.g. /electricians/auburn                         */
/* ────────────────────────────────────────────────────────────────── */

function TradeCityPage({
  tradeSlug,
  citySlug,
}: {
  tradeSlug: string;
  citySlug: string;
}) {
  const trade = getTradeBySlug(tradeSlug)!;
  const city = getCityBySlug(citySlug)!;
  const contractors = getContractorsByTradeAndCity(trade.slug, city.slug);
  const guides = getCostGuidesByTrade(trade.slug);
  const projects = getProjectsByCity(city.slug).filter(
    (p) => p.tradeSlug === trade.slug
  );

  // Separate featured/premium from free contractors
  const featured = contractors.filter(
    (c) => c.membershipStatus === "featured"
  );
  const premium = contractors.filter(
    (c) => c.membershipStatus === "premium"
  );
  const promoted = [...featured, ...premium];
  const standard = contractors.filter(
    (c) => c.membershipStatus === "free"
  );

  // Collect all specialties across contractors for this trade+city
  const allSpecialties = Array.from(
    new Set(contractors.flatMap((c) => c.specialties))
  );

  // Collect all reviews for contractors in this trade+city
  const allReviews = contractors.flatMap((c) =>
    getReviewsByContractor(c.slug).map((r) => ({ ...r, contractorName: c.name, contractorSlug: c.slug }))
  );
  allReviews.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-700/60">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>/</span>
        <Link href={`/${trade.slug}`} className="hover:text-gray-700">
          {trade.namePlural}
        </Link>
        <span>/</span>
        <Link href={`/${city.slug}`} className="hover:text-gray-700">
          {city.name}
        </Link>
      </nav>

      {/* Hero */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 sm:px-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {trade.namePlural} in {city.name}, CA
        </h1>
        <p className="mt-3 max-w-2xl text-gray-700/70">
          Find licensed {trade.namePlural.toLowerCase()} serving {city.name} and{" "}
          {city.county} County. Compare local professionals, read reviews, and
          request quotes.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
          <span className="font-medium">
            {contractors.length}{" "}
            {contractors.length === 1 ? "contractor" : "contractors"} listed
          </span>
          {allReviews.length > 0 && (
            <span className="font-medium">
              {allReviews.length}{" "}
              {allReviews.length === 1 ? "review" : "reviews"}
            </span>
          )}
          {guides.length > 0 && (
            <span className="font-medium">
              {guides.length} cost {guides.length === 1 ? "guide" : "guides"}
            </span>
          )}
        </div>
      </div>

      {/* Quick Start — What do you need? */}
      {allSpecialties.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            Common {trade.name} Services in {city.name}
          </h2>
          <p className="mt-2 text-sm text-gray-700/70">
            Local {trade.namePlural.toLowerCase()} in {city.name} commonly
            handle these types of projects:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {allSpecialties.map((s) => (
              <span
                key={s}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-800"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Featured & Premium Contractors */}
      {promoted.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            Top {trade.namePlural} in {city.name}
          </h2>
          <div className="mt-4 space-y-4">
            {promoted.map((c) => {
              const avg = getAverageRating(c.slug);
              const count = getReviewCount(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/${trade.slug}/${c.slug}`}
                  className="block rounded-lg border-2 border-gray-300 bg-gray-50/50 p-6 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {c.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800 capitalize">
                        {c.membershipStatus}
                      </span>
                      {c.licensed && (
                        <span className="text-xs font-medium text-gray-700">
                          Licensed
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700/70">
                    {c.specialties.join(" · ")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700/70">
                    {c.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-700/60">
                    <span>{c.yearsInBusiness} years in business</span>
                    <span>·</span>
                    <span>{c.phone}</span>
                    {avg !== null && (
                      <>
                        <span>·</span>
                        <span>
                          {avg} stars ({count}{" "}
                          {count === 1 ? "review" : "reviews"})
                        </span>
                      </>
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
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            {trade.name} Costs in {city.name}
          </h2>
          <p className="mt-2 text-sm text-gray-700/70">
            Typical pricing for {trade.name.toLowerCase()} projects in the{" "}
            {city.name} area.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Project Type
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">
                    Typical Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {guides.map((g) => (
                  <tr
                    key={g.slug}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/cost/${g.slug}`}
                        className="font-medium text-gray-900 underline decoration-gray-300 hover:decoration-gray-500"
                      >
                        {g.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800">
                      ${g.lowEstimate.toLocaleString()} &ndash; $
                      {g.highEstimate.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-700/40">
            Estimates based on typical projects in the Gold Country area.
            Actual costs vary by project scope and conditions.
          </p>
        </section>
      )}

      {/* All Contractors */}
      {standard.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            All {trade.namePlural} in {city.name}
          </h2>
          <div className="mt-4 space-y-3">
            {standard.map((c) => {
              const avg = getAverageRating(c.slug);
              const count = getReviewCount(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/${trade.slug}/${c.slug}`}
                  className="block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    {c.licensed && (
                      <span className="text-xs font-medium text-gray-700">
                        Licensed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-700/70">
                    {c.specialties.join(" · ")}
                  </p>
                  <p className="mt-2 text-sm text-gray-700/60">
                    {c.yearsInBusiness} years in business · {c.phone}
                    {avg !== null && (
                      <>
                        {" "}
                        · {avg} stars ({count}{" "}
                        {count === 1 ? "review" : "reviews"})
                      </>
                    )}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state when no contractors at all */}
      {contractors.length === 0 && (
        <section className="mt-10">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-800">
              No {trade.namePlural.toLowerCase()} listed in {city.name} yet.
            </p>
            <p className="mt-1 text-sm text-gray-700/60">
              Are you a {trade.name.toLowerCase()} in {city.name}?{" "}
              <span className="font-medium text-gray-700">
                Contact us to get listed.
              </span>
            </p>
          </div>
        </section>
      )}

      {/* Recent Reviews */}
      {allReviews.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            Recent {trade.name} Reviews in {city.name}
          </h2>
          <div className="mt-4 space-y-4">
            {allReviews.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-gray-200 p-5"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-gray-900">
                    {r.authorName}
                  </span>
                  <span className="text-sm text-gray-700/60">{r.date}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                  {r.projectType && (
                    <span className="ml-2 text-gray-700/60">
                      · {r.projectType}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-800/70">
                  {r.text}
                </p>
                <Link
                  href={`/${trade.slug}/${r.contractorSlug}`}
                  className="mt-2 inline-block text-sm font-medium text-gray-700 underline decoration-gray-300 hover:decoration-gray-500"
                >
                  {r.contractorName}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Projects */}
      {projects.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            Recent {trade.name} Projects in {city.name}
          </h2>
          <div className="mt-4 space-y-3">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                <h3 className="font-medium text-gray-900">{p.title}</h3>
                <p className="mt-1 text-sm text-gray-700/60">
                  Completed {p.completedDate}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mt-10 rounded-lg border-2 border-gray-300 bg-gray-50 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Are You a {trade.name} in {city.name}?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-gray-700/70">
          Get listed on GoldCountry.guide and connect with homeowners looking
          for {trade.namePlural.toLowerCase()} in {city.name} and {city.county}{" "}
          County. Free and premium listings available.
        </p>
        <p className="mt-4 text-sm font-semibold text-gray-900">
          Contact us to get started
        </p>
      </section>

      {/* Browse other trades in this city */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">
          Other Services in {city.name}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {trades
            .filter((t) => t.slug !== trade.slug)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}/${city.slug}`}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-800 transition-colors hover:bg-gray-50"
              >
                {t.namePlural}
              </Link>
            ))}
        </div>
      </section>

      {/* Browse this trade in other cities */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900">
          {trade.namePlural} in Other Cities
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cities
            .filter((c) => c.slug !== city.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/${trade.slug}/${c.slug}`}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-800 transition-colors hover:bg-gray-50"
              >
                {c.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Contractor Profile — e.g. /electricians/jc-electrical             */
/* ────────────────────────────────────────────────────────────────── */

function ContractorProfilePage({
  tradeSlug,
  contractorSlug,
}: {
  tradeSlug: string;
  contractorSlug: string;
}) {
  const trade = getTradeBySlug(tradeSlug)!;
  const contractor = getContractorBySlug(contractorSlug)!;
  const serviceCities = contractor.citySlugs
    .map((s) => getCityBySlug(s))
    .filter(Boolean);
  const reviews = getReviewsByContractor(contractor.slug);
  const avg = getAverageRating(contractor.slug);
  const projects = getProjectsByContractor(contractor.slug);
  const guides = getCostGuidesByTrade(trade.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-700/60">
        <Link href={`/${trade.slug}`} className="hover:text-gray-700">
          {trade.namePlural}
        </Link>
        <span>/</span>
        <span>{contractor.name}</span>
      </nav>

      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        {contractor.name}
      </h1>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {contractor.membershipStatus !== "free" && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 capitalize">
            {contractor.membershipStatus} Member
          </span>
        )}
        {contractor.licensed && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
            Licensed{" "}
            {contractor.licenseNumber && `(${contractor.licenseNumber})`}
          </span>
        )}
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
          {contractor.yearsInBusiness} years in business
        </span>
        {avg !== null && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
            {avg} stars ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </span>
        )}
      </div>

      <p className="mt-6 leading-relaxed text-gray-800/80">
        {contractor.description}
      </p>

      {/* Specialties */}
      {contractor.specialties.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-900">Specialties</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {contractor.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-800"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900">Contact Information</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-gray-800">Phone:</dt>
            <dd className="text-gray-700/70">{contractor.phone}</dd>
          </div>
          {contractor.website && (
            <div className="flex gap-2">
              <dt className="font-medium text-gray-800">Website:</dt>
              <dd>
                <a
                  href={contractor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  {contractor.website.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="font-medium text-gray-800">Service Areas:</dt>
            <dd className="text-gray-700/70">
              {serviceCities.map((city, i) => (
                <span key={city!.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={`/${trade.slug}/${city!.slug}`}
                    className="underline hover:text-gray-700"
                  >
                    {city!.name}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-800">Trade:</dt>
            <dd className="text-gray-700/70">
              <Link
                href={`/${trade.slug}`}
                className="underline hover:text-gray-700"
              >
                {trade.name}
              </Link>
            </dd>
          </div>
        </dl>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            Reviews ({reviews.length})
          </h2>
          <div className="mt-4 space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-gray-200 p-5"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-gray-900">
                    {r.authorName}
                  </span>
                  <span className="text-sm text-gray-700/60">{r.date}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                  {r.projectType && (
                    <span className="ml-2 text-gray-700/60">
                      · {r.projectType}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-800/70">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed projects */}
      {projects.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            Completed Projects
          </h2>
          <div className="mt-4 space-y-3">
            {projects.map((p) => {
              const pCity = getCityBySlug(p.citySlug);
              return (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <h3 className="font-medium text-gray-900">{p.title}</h3>
                  <p className="mt-1 text-sm text-gray-700/60">
                    {pCity?.name} · Completed {p.completedDate}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Related cost guides */}
      {guides.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            {trade.name} Cost Guides
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/cost/${g.slug}`}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                <h3 className="font-medium text-gray-900">{g.title}</h3>
                <p className="mt-1 text-sm font-bold text-gray-800">
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
