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

export function generateStaticParams() {
  return getAllCostGuideSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = getCostGuideBySlug(params.slug);
  if (!guide) return {};
  return {
    title: `${guide.title} in Gold Country (2025)`,
    description: guide.description,
  };
}

export default function CostGuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getCostGuideBySlug(params.slug);
  if (!guide) notFound();

  const trade = getTradeBySlug(guide.tradeSlug);
  const contractors = trade ? getContractorsByTrade(trade.slug) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-amber-700/60">
        {trade && (
          <Link href={`/${trade.slug}`} className="hover:text-amber-700">
            {trade.namePlural}
          </Link>
        )}
        <span>/</span>
        <span>Cost Guide</span>
      </nav>

      <h1 className="mt-2 text-3xl font-bold text-amber-900">
        {guide.title}
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">{guide.description}</p>

      {/* Cost range */}
      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-semibold text-amber-900">Typical Cost Range</h2>
        <p className="mt-2 text-3xl font-bold text-amber-800">
          ${guide.lowEstimate.toLocaleString()} &ndash; $
          {guide.highEstimate.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-amber-700/60">
          Based on typical projects in the Gold Country and Sierra foothills area
        </p>
      </div>

      {/* Factors */}
      <div className="mt-8 rounded-lg border border-amber-200 p-6">
        <h2 className="font-semibold text-amber-900">
          What Affects the Price?
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-amber-700/70">
          {guide.factors.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-amber-700/40">
          Last updated {guide.lastUpdated}
        </p>
      </div>

      {/* Find contractors by city */}
      {trade && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-amber-900">
            Find {trade.namePlural} by City
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${trade.slug}/${city.slug}`}
                className="rounded-full border border-amber-200 px-4 py-1.5 text-sm text-amber-800 transition-colors hover:bg-amber-50"
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
          <h2 className="text-xl font-bold text-amber-900">
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
                  className="block rounded-lg border border-amber-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-50"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-amber-900">{c.name}</span>
                    {c.licensed && (
                      <span className="text-xs font-medium text-green-700">
                        Licensed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-amber-700/60">
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
