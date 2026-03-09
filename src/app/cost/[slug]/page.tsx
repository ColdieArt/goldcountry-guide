import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCostGuideBySlug,
  getAllCostGuideSlugs,
} from "@/data/cost-guides";
import { getTradeBySlug } from "@/data/trades";

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-sm text-amber-700/60">
        {trade && (
          <Link href={`/${trade.slug}`} className="hover:text-amber-700">
            {trade.namePlural}
          </Link>
        )}
        {" / Cost Guide"}
      </div>

      <h1 className="mt-2 text-3xl font-bold text-amber-900">
        {guide.title}
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">{guide.description}</p>

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-semibold text-amber-900">Typical Cost Range</h2>
        <p className="mt-2 text-3xl font-bold text-amber-800">
          ${guide.lowEstimate.toLocaleString()} &ndash; $
          {guide.highEstimate.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-amber-700/60">
          Based on typical projects in the Auburn and Gold Country area
        </p>
      </div>

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

      {trade && (
        <div className="mt-8">
          <Link
            href={`/${trade.slug}/auburn`}
            className="inline-block rounded-lg bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
          >
            Find {trade.namePlural} in Auburn
          </Link>
        </div>
      )}
    </div>
  );
}
