import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProjectBySlug,
  getAllProjectSlugs,
  getProjectsByTrade,
} from "@/data/projects";
import { getTradeBySlug } from "@/data/trades";
import { getContractorBySlug } from "@/data/contractors";
import { getCityBySlug } from "@/data/cities";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const contractor = getContractorBySlug(project.contractorSlug);
  const trade = getTradeBySlug(project.tradeSlug);
  const city = getCityBySlug(project.citySlug);
  const relatedProjects = getProjectsByTrade(project.tradeSlug).filter(
    (p) => p.slug !== project.slug
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-700/60">
        {trade && (
          <>
            <Link href={`/${trade.slug}`} className="hover:text-gray-700">
              {trade.namePlural}
            </Link>
            <span>/</span>
          </>
        )}
        <span>Project</span>
      </nav>

      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        {project.title}
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-700/70">
        {project.description}
      </p>

      {/* Details */}
      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900">Project Details</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-gray-800">Completed:</dt>
            <dd className="text-gray-700/70">{project.completedDate}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-800">Location:</dt>
            <dd>
              {city ? (
                <Link
                  href={`/${city.slug}`}
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  {city.name}, CA
                </Link>
              ) : (
                <span className="text-gray-700/70 capitalize">
                  {project.citySlug}
                </span>
              )}
            </dd>
          </div>
          {trade && (
            <div className="flex gap-2">
              <dt className="font-medium text-gray-800">Trade:</dt>
              <dd>
                <Link
                  href={`/${trade.slug}`}
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  {trade.namePlural}
                </Link>
              </dd>
            </div>
          )}
          {contractor && (
            <div className="flex gap-2">
              <dt className="font-medium text-gray-800">Contractor:</dt>
              <dd>
                <Link
                  href={`/${trade?.slug}/${contractor.slug}`}
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  {contractor.name}
                </Link>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* CTA */}
      {trade && city && (
        <div className="mt-8">
          <Link
            href={`/${trade.slug}/${city.slug}`}
            className="inline-block rounded-lg bg-gray-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Find {trade.namePlural} in {city.name}
          </Link>
        </div>
      )}

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">
            More {trade?.namePlural} Projects
          </h2>
          <div className="mt-4 space-y-3">
            {relatedProjects.map((p) => {
              const pCity = getCityBySlug(p.citySlug);
              const pContractor = getContractorBySlug(p.contractorSlug);
              return (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <h3 className="font-medium text-gray-900">{p.title}</h3>
                  <p className="mt-1 text-sm text-gray-700/60">
                    {pContractor?.name} · {pCity?.name} · {p.completedDate}
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
