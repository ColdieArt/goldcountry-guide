import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCostGuideBySlug,
  getAllCostGuideSlugs,
  getCostGuidesByTrade,
} from "@/data/cost-guides";
import { getTradeBySlug } from "@/data/trades";
import { cities } from "@/data/cities";
import {
  getContractorsByTrade,
  getContractorsByTradeAndCity,
} from "@/data/contractors";
import { getAverageRating, getReviewCount } from "@/data/reviews";
import QuickStart from "@/components/QuickStart";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllCostGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getCostGuideBySlug(slug);
  if (!guide) return {};
  const year = new Date(guide.lastUpdated).getFullYear();
  const trade = getTradeBySlug(guide.tradeSlug);
  return {
    title: `${guide.title} in Gold Country, CA (${year}) — Pricing Guide`,
    description: `${guide.description} Typical range: $${guide.lowEstimate.toLocaleString()}–$${guide.highEstimate.toLocaleString()}.${trade ? ` Find ${trade.namePlural.toLowerCase()} near you.` : ""}`,
  };
}

export default async function CostGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getCostGuideBySlug(slug);
  if (!guide) notFound();

  const trade = getTradeBySlug(guide.tradeSlug);
  const contractors = trade ? getContractorsByTrade(trade.slug) : [];
  const relatedGuides = trade
    ? getCostGuidesByTrade(trade.slug).filter((g) => g.slug !== guide.slug)
    : [];
  const year = new Date(guide.lastUpdated).getFullYear();

  // Cities that have active contractors for this trade
  const citiesWithContractors = trade
    ? cities.filter(
        (c) => getContractorsByTradeAndCity(trade.slug, c.slug).length > 0
      )
    : [];

  // Structured data
  const costGuideLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: guide.title,
    description: guide.description,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: guide.lowEstimate,
      highPrice: guide.highEstimate,
      priceCurrency: "USD",
      offerCount: contractors.length,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://goldcountry.guide/" },
      ...(trade
        ? [{ "@type": "ListItem", position: 2, name: trade.namePlural, item: `https://goldcountry.guide/${trade.slug}` }]
        : []),
      { "@type": "ListItem", position: trade ? 3 : 2, name: guide.title },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={[costGuideLd, breadcrumbLd]} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-700/60">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        {trade && (
          <>
            <Link href={`/${trade.slug}`} className="hover:text-gray-700">
              {trade.namePlural}
            </Link>
            <span>/</span>
          </>
        )}
        <span>{guide.title}</span>
      </nav>

      {/* ── Direct Answer ─────────────────────────────────────────── */}
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        How Much Does a {guide.title.replace(/ Cost$/, "")} Cost in Gold Country?
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-gray-800/70">
        <strong className="text-gray-900">
          ${guide.lowEstimate.toLocaleString()} – ${guide.highEstimate.toLocaleString()}
        </strong>{" "}
        is the typical range for {guide.title.toLowerCase().replace(/ cost$/, "")} projects
        in the Gold Country and Sierra foothills area ({year} prices).
      </p>
      <p className="mt-2 text-sm text-gray-700/50">
        Based on local project data · Updated {guide.lastUpdated}
      </p>

      {/* ── Quick Cost Table ──────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {guide.title.replace(/ Cost$/, "")} Cost by Project Scope
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-700/70">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price Range</th>
                <th className="hidden px-4 py-3 sm:table-cell">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {guide.costTiers.map((tier) => (
                <tr key={tier.label}>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {tier.label}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-800">
                    ${tier.lowPrice.toLocaleString()} – ${tier.highPrice.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-4 text-gray-700/70 sm:table-cell">
                    {tier.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile: show tier descriptions below table */}
        <div className="mt-4 space-y-3 sm:hidden">
          {guide.costTiers.map((tier) => (
            <div key={tier.label} className="rounded-lg border border-gray-100 p-3">
              <p className="text-sm font-medium text-gray-900">{tier.label}</p>
              <p className="mt-1 text-sm text-gray-700/70">{tier.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What Affects the Price ─────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          What Affects the Price?
        </h2>
        <ul className="mt-4 space-y-2">
          {guide.factors.map((f) => (
            <li key={f} className="flex items-start gap-3 text-gray-800/80">
              <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Local Context ─────────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          Pricing in Gold Country &amp; the Sierra Foothills
        </h2>
        <p className="mt-3 leading-relaxed text-gray-800/70">
          {guide.localContext}
        </p>
      </section>

      {/* ── Get Started CTA ───────────────────────────────────────── */}
      {trade && (
        <section className="mt-10 rounded-lg border-2 border-gray-300 bg-gray-50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Get a Quote for Your Project
          </h2>
          <p className="mt-2 text-sm text-gray-700/70">
            Answer a few quick questions and we&apos;ll connect you with
            licensed {trade.namePlural.toLowerCase()} in your area.
          </p>
          <div className="mt-4">
            <QuickStart
              trade={trade.name}
              tradePlural={trade.namePlural}
              projectTypes={[
                guide.title.replace(/ Cost$/, ""),
                ...contractors
                  .flatMap((c) => c.specialties)
                  .filter(
                    (s, i, arr) =>
                      arr.indexOf(s) === i &&
                      s !== guide.title.replace(/ Cost$/, "")
                  ),
              ]}
            />
          </div>
        </section>
      )}

      {/* ── Find Contractors by City ──────────────────────────────── */}
      {trade && citiesWithContractors.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            Find {trade.namePlural} Near You
          </h2>
          <p className="mt-2 text-sm text-gray-700/70">
            Browse licensed {trade.namePlural.toLowerCase()} by city to compare
            options and read reviews.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {citiesWithContractors.map((city) => {
              const count = getContractorsByTradeAndCity(
                trade.slug,
                city.slug
              ).length;
              return (
                <Link
                  key={city.slug}
                  href={`/${trade.slug}/${city.slug}`}
                  className="flex items-baseline justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {trade.namePlural} in {city.name}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
          {/* Also link cities without contractors yet */}
          {citiesWithContractors.length < cities.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {cities
                .filter(
                  (c) =>
                    !citiesWithContractors.some((cw) => cw.slug === c.slug)
                )
                .map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${trade.slug}/${city.slug}`}
                    className="rounded-full border border-dashed border-gray-200 px-3 py-1 text-xs text-gray-500 transition-colors hover:border-gray-300"
                  >
                    {city.name}
                  </Link>
                ))}
            </div>
          )}
        </section>
      )}

      {/* ── Top Contractors ───────────────────────────────────────── */}
      {contractors.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            {trade!.namePlural} in Gold Country
          </h2>
          <p className="mt-2 text-sm text-gray-700/70">
            Licensed professionals who handle{" "}
            {guide.title.toLowerCase().replace(/ cost$/, "")} projects in the area.
          </p>
          <div className="mt-4 space-y-3">
            {contractors.map((c) => {
              const avg = getAverageRating(c.slug);
              const count = getReviewCount(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/${trade!.slug}/${c.slug}`}
                  className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <div className="flex items-center gap-2">
                      {c.membershipStatus !== "free" && (
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium capitalize text-gray-800">
                          {c.membershipStatus}
                        </span>
                      )}
                      {c.licensed && (
                        <span className="text-xs font-medium text-gray-700">
                          Licensed
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-700/60">
                    {c.yearsInBusiness} years in business
                    {avg !== null && <> · {avg} stars ({count})</>}
                    {" · "}
                    {c.specialties.slice(0, 3).join(", ")}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Related Cost Guides ───────────────────────────────────── */}
      {relatedGuides.length > 0 && (
        <section className="mt-10 border-t border-gray-100 pt-10">
          <h2 className="text-xl font-bold text-gray-900">
            More {trade!.name} Cost Guides
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/cost/${g.slug}`}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                <h3 className="font-medium text-gray-900">{g.title}</h3>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  ${g.lowEstimate.toLocaleString()} – ${g.highEstimate.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
