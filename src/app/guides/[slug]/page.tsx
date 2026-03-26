import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuideBySlug, getAllGuideSlugs, getGuidesByCity, getGuidesByTrade } from "@/data/guides";
import { getCityBySlug } from "@/data/cities";
import { getTradeBySlug } from "@/data/trades";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const city = getCityBySlug(guide.citySlug);
  const trade = getTradeBySlug(guide.tradeSlug);

  // Related guides: same city or same trade, excluding current
  const relatedByCity = city ? getGuidesByCity(city.slug).filter((g) => g.slug !== guide.slug).slice(0, 3) : [];
  const relatedByTrade = trade ? getGuidesByTrade(trade.slug).filter((g) => g.slug !== guide.slug && !relatedByCity.some((r) => r.slug === g.slug)).slice(0, 3) : [];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedDate,
    author: {
      "@type": "Organization",
      name: "Gold Country Guide",
      url: "https://goldcountry.guide",
    },
    publisher: {
      "@type": "Organization",
      name: "Gold Country Guide",
      url: "https://goldcountry.guide",
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
      ...(city
        ? [{ "@type": "ListItem", position: trade ? 3 : 2, name: city.name, item: `https://goldcountry.guide/${city.slug}` }]
        : []),
      { "@type": "ListItem", position: (trade ? 3 : 2) + (city ? 1 : 0), name: guide.title },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={[articleLd, breadcrumbLd]} />

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-700/60">
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
        {city && (
          <>
            <Link href={`/${city.slug}`} className="hover:text-gray-700">
              {city.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="truncate">{guide.title}</span>
      </nav>

      {/* Header */}
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {guide.title}
      </h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-gray-700/50">
        {city && <span>{city.name}, {city.county} County</span>}
        {city && trade && <span className="text-gray-300">|</span>}
        {trade && <span>{trade.namePlural}</span>}
        <span className="text-gray-300">|</span>
        <span>Updated {guide.publishedDate}</span>
      </div>

      {/* Intro */}
      <div className="mt-8 text-lg leading-relaxed text-gray-800/80">
        {guide.intro.split("\n\n").map((p, i) => (
          <p key={i} className={i > 0 ? "mt-4" : ""}>
            {p}
          </p>
        ))}
      </div>

      {/* Sections */}
      {guide.sections.map((section, i) => (
        <section key={i} className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">{section.heading}</h2>
          <div className="mt-3 space-y-4 leading-relaxed text-gray-800/80">
            {section.body.split("\n\n").map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="mt-12 rounded-lg border-2 border-gray-300 bg-gray-50 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          Ready to Get Started?
        </h2>
        <p className="mt-2 text-gray-700/70">
          Tell us about your project and we&apos;ll connect you with licensed{" "}
          {trade ? trade.namePlural.toLowerCase() : "contractors"} in{" "}
          {city ? city.name : "Gold Country"}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/request"
            className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
          >
            Request a Quote
          </Link>
          {trade && city && (
            <Link
              href={`/${trade.slug}/${city.slug}`}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
            >
              Browse {trade.namePlural} in {city.name}
            </Link>
          )}
        </div>
      </section>

      {/* Related Guides */}
      {(relatedByCity.length > 0 || relatedByTrade.length > 0) && (
        <section className="mt-12 border-t border-gray-100 pt-10">
          <h2 className="text-xl font-bold text-gray-900">Related Guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[...relatedByCity, ...relatedByTrade].slice(0, 4).map((g) => {
              const gCity = getCityBySlug(g.citySlug);
              const gTrade = getTradeBySlug(g.tradeSlug);
              return (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <h3 className="font-medium text-gray-900">{g.title}</h3>
                  <p className="mt-1 text-sm text-gray-700/60">
                    {gCity?.name}{gTrade && <> · {gTrade.namePlural}</>}
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
