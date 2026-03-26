import Link from "next/link";
import { guides } from "@/data/guides";
import { getCityBySlug } from "@/data/cities";
import { getTradeBySlug } from "@/data/trades";
import { cities } from "@/data/cities";
import { trades } from "@/data/trades";

export const metadata = {
  title: "Home Improvement Guides for Gold Country, CA | Gold Country Guide",
  description:
    "Practical guides for Gold Country homeowners — electrical, plumbing, and more. Real advice from locals who know the Sierra foothills.",
};

export default function GuidesIndex() {
  // Group guides by trade
  const tradeGroups = new Map<string, typeof guides>();
  for (const guide of guides) {
    const existing = tradeGroups.get(guide.tradeSlug) ?? [];
    existing.push(guide);
    tradeGroups.set(guide.tradeSlug, existing);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="flex items-center gap-1 text-sm text-gray-700/60">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <span>Guides</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Gold Country Home Improvement Guides
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-gray-800/70">
        Straight-talk guides written for homeowners in the Sierra foothills.
        No fluff, no sales pitches — just practical advice from people who
        live here.
      </p>

      {/* Filter by city */}
      <div className="mt-8 flex flex-wrap gap-2">
        {cities
          .filter((c) => guides.some((g) => g.citySlug === c.slug))
          .map((city) => {
            const count = guides.filter((g) => g.citySlug === city.slug).length;
            return (
              <span
                key={city.slug}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700"
              >
                {city.name} ({count})
              </span>
            );
          })}
      </div>

      {/* Guides grouped by trade */}
      {Array.from(tradeGroups.entries()).map(([tradeSlug, tradeGuides]) => {
        const trade = getTradeBySlug(tradeSlug);
        return (
          <section key={tradeSlug} className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">
              {trade?.namePlural ?? tradeSlug} Guides
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tradeGuides.map((guide) => {
                const city = getCityBySlug(guide.citySlug);
                return (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-700/60 line-clamp-3">
                      {guide.intro.split("\n\n")[0]}
                    </p>
                    <p className="mt-3 text-xs text-gray-700/50">
                      {city?.name}, {city?.county} County
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="mt-16 rounded-lg border-2 border-gray-300 bg-gray-50 p-6 text-center sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          Need Help With a Project?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-gray-700/70">
          Tell us what you&apos;re working on and we&apos;ll connect you with
          licensed, local contractors who know Gold Country.
        </p>
        <Link
          href="/request"
          className="mt-4 inline-block rounded-lg bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
