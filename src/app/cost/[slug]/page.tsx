import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCostGuideBySlug,
  getAllCostGuideSlugs,
} from "@/data/cost-guides";
import { getTradeBySlug } from "@/data/trades";
import { cities } from "@/data/cities";
import { getContractorsByTrade } from "@/data/contractors";
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={costGuideLd} />

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

      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        {guide.title}
      </h1>
      <p className="mt-3 max-w-2xl text-gray-700/70">{guide.description}</p>

      {/* Cost range */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="font-semibold text-gray-900">Typical Cost Range</h2>
        <p className="mt-2 text-3xl font-bold text-gray-800">
          ${guide.lowEstimate.toLocaleString()} &ndash; $
          {guide.highEstimate.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-700/60">
          Based on typical projects in the Gold Country and Sierra foothills area
        </p>
      </div>

      {/* Factors */}
      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900">
          What Affects the Price?
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700/70">
          {guide.factors.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-700/40">
          Last updated {guide.lastUpdated}
        </p>
      </div>

      {/* Guided Quick Start */}
      {trade && (
        <section className="mt-8">
          <QuickStart
            trade={trade.name}
            tradePlural={trade.namePlural}
            projectTypes={[
              guide.title,
              ...contractors.flatMap((c) => c.specialties).filter(
                (s, i, arr) => arr.indexOf(s) === i && s !== guide.title
              ),
            ]}
          />
        </section>
      )}

      {/* Find contractors by city */}
      {trade && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            Find {trade.namePlural} by City
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${trade.slug}/${city.slug}`}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-800 transition-colors hover:bg-gray-50"
              >
                {trade.namePlural} in {city.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related contractors */}
      {contractors.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            {trade!.namePlural} in Gold Country
          </h2>
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
                    {c.licensed && (
                      <span className="text-xs font-medium text-gray-700">
                        Licensed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-700/60">
                    {c.yearsInBusiness} years in business
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
    </div>
  );
}
