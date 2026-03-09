import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProjectBySlug,
  getAllProjectSlugs,
} from "@/data/projects";
import { getTradeBySlug } from "@/data/trades";
import { getContractorBySlug } from "@/data/contractors";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();
  const contractor = getContractorBySlug(project.contractorSlug);

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
        <h2 className="font-semibold text-amber-900">Project Details</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-amber-800">Completed:</dt>
            <dd className="text-amber-700/70">{project.completedDate}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-amber-800">Location:</dt>
            <dd className="text-amber-700/70 capitalize">{project.citySlug}</dd>
          </div>
          {contractor && (
            <div className="flex gap-2">
              <dt className="font-medium text-amber-800">Contractor:</dt>
              <dd>
                <Link
                  href={`/${trade?.slug}/${contractor.slug}`}
                  className="text-amber-700 underline hover:text-amber-900"
                >
                  {contractor.name}
                </Link>
              </dd>
            </div>
          )}
        </dl>
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
