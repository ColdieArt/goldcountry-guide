import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProjectTypeBySlug,
  getAllProjectTypeSlugs,
} from "@/data/projects";
import { getTradeBySlug } from "@/data/trades";

export function generateStaticParams() {
  return getAllProjectTypeSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectTypeBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectTypePage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectTypeBySlug(params.slug);
  if (!project) notFound();

  const trade = getTradeBySlug(project.tradeSlug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-sm text-amber-700/60">
        {trade && (
          <Link href={`/${trade.slug}`} className="hover:text-amber-700">
            {trade.namePlural}
          </Link>
        )}
        {" / Project"}
      </div>

      <h1 className="mt-2 text-3xl font-bold text-amber-900">
        {project.title}
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">
        {project.description}
      </p>

      <div className="mt-8 rounded-lg border border-amber-200 p-6">
        <h2 className="font-semibold text-amber-900">What to Expect</h2>
        <p className="mt-2 text-sm text-amber-700/70">
          Detailed project guide content coming soon. This page will cover
          scope, timeline, permits, and what to look for in a contractor.
        </p>
      </div>

      {trade && (
        <div className="mt-8 flex gap-3">
          <Link
            href={`/${trade.slug}/auburn`}
            className="inline-block rounded-lg bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
          >
            Find {trade.namePlural} in Auburn
          </Link>
          <Link
            href={`/cost/${project.slug}-cost`}
            className="inline-block rounded-lg border border-amber-300 px-6 py-3 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-50"
          >
            View Cost Guide
          </Link>
        </div>
      )}
    </div>
  );
}
