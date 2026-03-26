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
    <div className="bg-neutral-950 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <JsonLd data={[costGuideLd, breadcrumbLd]} />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <span>/</span>
          {trade && (
            <>
              <Link href={`/${trade.slug}`} className="transition-colors hover:text-white">
                {trade.namePlural}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-neutral-400">{guide.title}</span>
        </nav>

        {/* ── Direct Answer ─────────────────────────────────────────── */}
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          How Much Does a {guide.title.replace(/ Cost$/, "")} Cost in Gold Country?
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-400 leading-relaxed">
          <strong className="text-amber-400 text-xl">
            ${guide.lowEstimate.toLocaleString()} – ${guide.highEstimate.toLocaleString()}
          </strong>{" "}
          is the typical range for {guide.title.toLowerCase().replace(/ cost$/, "")} projects
          in the Gold Country and Sierra foothills area ({year} prices).
        </p>
        <p className="mt-3 text-sm text-neutral-500">
          Based on local project data · Updated {guide.lastUpdated}
        </p>

        {/* ── Quick Cost Table ──────────────────────────────────────── */}
        <section className="mt-14">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
            Pricing Breakdown
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            {guide.title.replace(/ Cost$/, "")} Cost by Project Scope
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Price Range</th>
                  <th className="hidden px-5 py-4 sm:table-cell">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {guide.costTiers.map((tier) => (
                  <tr key={tier.label} className="transition-colors hover:bg-neutral-900/50">
                    <td className="px-5 py-4 font-medium text-white">
                      {tier.label}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-amber-400">
                      ${tier.lowPrice.toLocaleString()} – ${tier.highPrice.toLocaleString()}
                    </td>
                    <td className="hidden px-5 py-4 text-neutral-400 sm:table-cell">
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
              <div key={tier.label} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <p className="text-sm font-medium text-white">{tier.label}</p>
                <p className="mt-1 text-sm text-neutral-400">{tier.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What Affects the Price ─────────────────────────────────── */}
        <section className="mt-14">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
            Key Factors
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            What Affects the Price?
          </h2>
          <ul className="mt-6 space-y-3">
            {guide.factors.map((f) => (
              <li key={f} className="flex items-start gap-3 text-neutral-400">
                <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Local Context ─────────────────────────────────────────── */}
        <section className="mt-14">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
            Local Insight
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            Pricing in Gold Country &amp; the Sierra Foothills
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-400">
            {guide.localContext}
          </p>
        </section>

        {/* ── Get Started CTA ───────────────────────────────────────── */}
        {trade && (
          <section className="mt-14 rounded-2xl border border-amber-500/20 bg-neutral-900 p-8 sm:p-10">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
              Ready to Start?
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              Get a Quote for Your Project
            </h2>
            <p className="mt-3 text-neutral-400">
              Answer a few quick questions and we&apos;ll connect you with
              licensed {trade.namePlural.toLowerCase()} in your area.
            </p>
            <div className="mt-6">
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
          <section className="mt-14 border-t border-neutral-800 pt-14">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
              Browse by Location
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              Find {trade.namePlural} Near You
            </h2>
            <p className="mt-3 text-neutral-400">
              Browse licensed {trade.namePlural.toLowerCase()} by city to compare
              options and read reviews.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {citiesWithContractors.map((city) => {
                const count = getContractorsByTradeAndCity(
                  trade.slug,
                  city.slug
                ).length;
                return (
                  <Link
                    key={city.slug}
                    href={`/${trade.slug}/${city.slug}`}
                    className="flex items-baseline justify-between rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <span className="text-sm font-medium text-white">
                      {trade.namePlural} in {city.name}
                    </span>
                    <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
            {/* Also link cities without contractors yet */}
            {citiesWithContractors.length < cities.length && (
              <div className="mt-4 flex flex-wrap gap-2">
                {cities
                  .filter(
                    (c) =>
                      !citiesWithContractors.some((cw) => cw.slug === c.slug)
                  )
                  .map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${trade.slug}/${city.slug}`}
                      className="rounded-full border border-dashed border-neutral-700 px-3 py-1 text-xs text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-300"
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
          <section className="mt-14 border-t border-neutral-800 pt-14">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
              Top Professionals
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              {trade!.namePlural} in Gold Country
            </h2>
            <p className="mt-3 text-neutral-400">
              Licensed professionals who handle{" "}
              {guide.title.toLowerCase().replace(/ cost$/, "")} projects in the area.
            </p>
            <div className="mt-6 space-y-3">
              {contractors.map((c) => {
                const avg = getAverageRating(c.slug);
                const count = getReviewCount(c.slug);
                return (
                  <Link
                    key={c.slug}
                    href={`/${trade!.slug}/${c.slug}`}
                    className="block rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium text-white">{c.name}</span>
                      <div className="flex items-center gap-2">
                        {c.membershipStatus !== "free" && (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-amber-400">
                            {c.membershipStatus}
                          </span>
                        )}
                        {c.licensed && (
                          <span className="text-xs font-medium text-neutral-500">
                            Licensed
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-neutral-500">
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
          <section className="mt-14 border-t border-neutral-800 pt-14">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
              Related Guides
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              More {trade!.name} Cost Guides
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {relatedGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/cost/${g.slug}`}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <h3 className="font-medium text-white">{g.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-amber-400">
                    ${g.lowEstimate.toLocaleString()} – ${g.highEstimate.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
