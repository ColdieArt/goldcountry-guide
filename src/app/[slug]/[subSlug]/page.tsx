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
import { getReviewsByContractor, getAverageRating } from "@/data/reviews";
import { getProjectsByContractor } from "@/data/projects";
import { getCostGuidesByTrade } from "@/data/cost-guides";

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-amber-700/60">
        <Link href={`/${trade.slug}`} className="hover:text-amber-700">
          {trade.namePlural}
        </Link>
        <span>/</span>
        <Link href={`/${city.slug}`} className="hover:text-amber-700">
          {city.name}
        </Link>
      </nav>

      <h1 className="mt-2 text-3xl font-bold text-amber-900">
        {trade.namePlural} in {city.name}, CA
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">
        Browse licensed {trade.namePlural.toLowerCase()} serving {city.name} and{" "}
        {city.county} County.
      </p>

      {/* Contractor cards */}
      {contractors.length > 0 ? (
        <div className="mt-8 space-y-4">
          {contractors.map((c) => {
            const avg = getAverageRating(c.slug);
            const reviews = getReviewsByContractor(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/${trade.slug}/${c.slug}`}
                className="block rounded-lg border border-amber-200 p-5 transition-colors hover:border-amber-400 hover:bg-amber-50"
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold text-amber-900">
                    {c.name}
                  </h2>
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
                <p className="mt-1 text-sm text-amber-700/70">
                  {c.description}
                </p>
                <p className="mt-2 text-sm text-amber-700/60">
                  {c.yearsInBusiness} years in business · {c.phone}
                  {avg !== null && (
                    <> · {avg} stars ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</>
                  )}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-amber-800">
            No {trade.namePlural.toLowerCase()} listed in {city.name} yet.
          </p>
          <p className="mt-1 text-sm text-amber-700/60">
            Are you a {trade.name.toLowerCase()} in {city.name}?{" "}
            <span className="font-medium text-amber-700">
              Contact us to get listed.
            </span>
          </p>
        </div>
      )}

      {/* Other cities for this trade */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-amber-900">
          {trade.namePlural} in Other Cities
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cities
            .filter((c) => c.slug !== city.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/${trade.slug}/${c.slug}`}
                className="rounded-full border border-amber-200 px-4 py-1.5 text-sm text-amber-800 transition-colors hover:bg-amber-50"
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
      <nav className="flex items-center gap-1 text-sm text-amber-700/60">
        <Link href={`/${trade.slug}`} className="hover:text-amber-700">
          {trade.namePlural}
        </Link>
        <span>/</span>
        <span>{contractor.name}</span>
      </nav>

      <h1 className="mt-2 text-3xl font-bold text-amber-900">
        {contractor.name}
      </h1>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {contractor.membershipStatus !== "free" && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 capitalize">
            {contractor.membershipStatus} Member
          </span>
        )}
        {contractor.licensed && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            Licensed{" "}
            {contractor.licenseNumber && `(${contractor.licenseNumber})`}
          </span>
        )}
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          {contractor.yearsInBusiness} years in business
        </span>
        {avg !== null && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {avg} stars ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </span>
        )}
      </div>

      <p className="mt-6 leading-relaxed text-amber-800/80">
        {contractor.description}
      </p>

      {/* Specialties */}
      {contractor.specialties.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-amber-900">Specialties</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {contractor.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="mt-8 rounded-lg border border-amber-200 p-6">
        <h2 className="font-semibold text-amber-900">Contact Information</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-amber-800">Phone:</dt>
            <dd className="text-amber-700/70">{contractor.phone}</dd>
          </div>
          {contractor.website && (
            <div className="flex gap-2">
              <dt className="font-medium text-amber-800">Website:</dt>
              <dd>
                <a
                  href={contractor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline hover:text-amber-900"
                >
                  {contractor.website.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="font-medium text-amber-800">Service Areas:</dt>
            <dd className="text-amber-700/70">
              {serviceCities.map((city, i) => (
                <span key={city!.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={`/${trade.slug}/${city!.slug}`}
                    className="underline hover:text-amber-700"
                  >
                    {city!.name}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-amber-800">Trade:</dt>
            <dd className="text-amber-700/70">
              <Link
                href={`/${trade.slug}`}
                className="underline hover:text-amber-700"
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
          <h2 className="text-xl font-bold text-amber-900">
            Reviews ({reviews.length})
          </h2>
          <div className="mt-4 space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-amber-200 p-5"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-amber-900">
                    {r.authorName}
                  </span>
                  <span className="text-sm text-amber-700/60">{r.date}</span>
                </div>
                <div className="mt-1 text-sm text-amber-600">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                  {r.projectType && (
                    <span className="ml-2 text-amber-700/60">
                      · {r.projectType}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-amber-800/70">
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
          <h2 className="text-xl font-bold text-amber-900">
            Completed Projects
          </h2>
          <div className="mt-4 space-y-3">
            {projects.map((p) => {
              const pCity = getCityBySlug(p.citySlug);
              return (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="block rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
                >
                  <h3 className="font-medium text-amber-900">{p.title}</h3>
                  <p className="mt-1 text-sm text-amber-700/60">
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
          <h2 className="text-xl font-bold text-amber-900">
            {trade.name} Cost Guides
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/cost/${g.slug}`}
                className="rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
              >
                <h3 className="font-medium text-amber-900">{g.title}</h3>
                <p className="mt-1 text-sm font-bold text-amber-800">
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
