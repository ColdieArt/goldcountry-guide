"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ──────────────────────────────────────────────────────────────────────────
   Types for serialized data passed from the server page
   ────────────────────────────────────────────────────────────────────────── */

interface TradeInfo {
  slug: string;
  name: string;
  namePlural: string;
  description: string;
  contractorCount: number;
  icon: string;
}

interface CityInfo {
  slug: string;
  name: string;
  county: string;
}

interface FeaturedContractor {
  slug: string;
  name: string;
  tradeSlug: string;
  tradeName: string;
  specialties: string[];
  yearsInBusiness: number;
  avgRating: number | null;
  reviewCount: number;
}

interface HomeV2Props {
  trades: TradeInfo[];
  cities: CityInfo[];
  featured: FeaturedContractor[];
  totalContractors: number;
  totalCities: number;
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */

export default function HomeV2({
  trades,
  cities,
  featured,
  totalContractors,
  totalCities,
}: HomeV2Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Stats section reveal on scroll
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll to results when trade selected
  useEffect(() => {
    if (selectedTrade && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTrade]);

  function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      localStorage.setItem(
        "gcg-lead-form",
        JSON.stringify({
          form: { serviceCategory: "not-sure", notSureText: query.trim() },
          step: 2,
        })
      );
    } catch { /* noop */ }
    router.push("/request");
  }

  const activeTrade = trades.find((t) => t.slug === selectedTrade);

  return (
    <div className="bg-neutral-950 text-white">
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 - FULL-VIEWPORT HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>

        {/* Floating nav */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${heroVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/v2" className="text-lg font-bold tracking-tight text-white">
              GoldCountry<span className="text-amber-400">.guide</span>
            </Link>
            <div className="hidden items-center gap-6 text-sm text-neutral-400 md:flex">
              {trades.slice(0, 5).map((t) => (
                <Link key={t.slug} href={`/${t.slug}`} className="transition-colors hover:text-white">
                  {t.namePlural}
                </Link>
              ))}
              <Link
                href="/request"
                className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
              >
                Get Quotes
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className={`relative z-10 mx-auto max-w-4xl text-center transition-all duration-1000 ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Vetted by local tradespeople, not algorithms
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl">
            The only contractors
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Gold Country trusts
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 sm:text-xl">
            Hand-picked by the trades community. Not a directory of everyone with a license -
            a short list of the contractors other contractors vouch for.
          </p>

          {/* AI-style conversational input */}
          <form onSubmit={handleQuerySubmit} className="mx-auto mt-10 max-w-2xl">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-500/50 via-yellow-500/50 to-amber-500/50 opacity-0 blur transition-opacity group-focus-within:opacity-100" />
              <div className="relative flex items-center rounded-2xl border border-neutral-700 bg-neutral-900 transition-colors group-focus-within:border-amber-500/50">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tell us what you need... &quot;roof is leaking&quot;, &quot;panel upgrade&quot;, &quot;build an ADU&quot;"
                  className="flex-1 bg-transparent px-6 py-4 text-base text-white placeholder:text-neutral-500 focus:outline-none sm:text-lg"
                  aria-label="Describe your project"
                />
                <button
                  type="submit"
                  className="m-2 shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-neutral-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95"
                >
                  Match Me
                </button>
              </div>
            </div>
          </form>

          {/* Quick-select trade pills */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
            {trades.map((t) => (
              <button
                key={t.slug}
                onClick={() => setSelectedTrade(t.slug === selectedTrade ? null : t.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  t.slug === selectedTrade
                    ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/25 scale-105"
                    : "border border-neutral-700 text-neutral-300 hover:border-amber-500/50 hover:text-white"
                }`}
              >
                <span className="mr-1.5">{t.icon}</span>
                {t.namePlural}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <div className="flex flex-col items-center gap-2 text-neutral-500">
            <span className="text-xs uppercase tracking-widest">Explore</span>
            <div className="h-8 w-px animate-pulse bg-gradient-to-b from-neutral-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1.5 - INLINE RESULTS (when trade selected)
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTrade && (
        <section ref={resultsRef} className="relative border-t border-neutral-800 bg-neutral-900 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
                  {activeTrade.icon} {activeTrade.namePlural}
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  {activeTrade.contractorCount} vetted {activeTrade.namePlural.toLowerCase()} ready to work
                </h2>
              </div>
              <button
                onClick={() => setSelectedTrade(null)}
                className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white"
              >
                Clear
              </button>
            </div>

            {/* City filter */}
            <div className="mt-8">
              <p className="mb-3 text-sm text-neutral-500">Select your area:</p>
              <div className="flex flex-wrap gap-2">
                {cities.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCity(c.slug === selectedCity ? null : c.slug)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      c.slug === selectedCity
                        ? "bg-white text-neutral-950"
                        : "border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA to full trade page */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/${activeTrade.slug}${selectedCity ? `#${selectedCity}` : ""}`}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-neutral-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
              >
                View {activeTrade.namePlural}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-600 px-6 py-3 font-semibold text-white transition-colors hover:border-white"
              >
                Request Quotes
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 - SOCIAL PROOF BAR
          ═══════════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative border-t border-neutral-800 bg-neutral-950 px-4 py-20">
        <div className={`mx-auto grid max-w-5xl gap-8 sm:grid-cols-3 transition-all duration-1000 ${statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="text-center">
            <p className="text-5xl font-extrabold text-white">{totalContractors}</p>
            <p className="mt-2 text-sm text-neutral-500">Vetted Contractors</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-extrabold text-white">{totalCities}</p>
            <p className="mt-2 text-sm text-neutral-500">Foothill Communities</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-extrabold text-white">100%</p>
            <p className="mt-2 text-sm text-neutral-500">Trade-Verified</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 - THE DIFFERENCE (story/mission)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-neutral-800 px-4 py-24">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 bg-amber-500/5 blur-[100px]" />
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Not another directory</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Built by a local who got tired
            <br className="hidden sm:block" />
            of the guessing game
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="space-y-4 text-lg leading-relaxed text-neutral-400">
              <p>
                Most contractor sites list everyone with a license and a credit card.
                You scroll through dozens of results, read fake reviews, and cross your fingers.
              </p>
              <p>
                We asked a different question: <span className="text-white">which contractors do other
                contractors actually trust?</span>
              </p>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-neutral-400">
              <p>
                Every contractor on this site was recommended by other tradespeople in Gold Country.
                The electricians vouch for the plumbers. The GCs vouch for the subs.
                That&apos;s vetting you can&apos;t fake.
              </p>
              <p className="text-white">
                Small list. Real reputation. No pay-to-play.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 - HOW IT WORKS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-neutral-800 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">How it works</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Three steps. No runaround.</h2>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Tell us what you need",
                desc: "Type a few words or pick a trade. Our system matches you to the right category instantly.",
              },
              {
                step: "02",
                title: "Pick your town",
                desc: "Select your area and see only the vetted contractors who actually serve your community.",
              },
              {
                step: "03",
                title: "Connect directly",
                desc: "View profiles, see real reviews, and request quotes from contractors who've earned their spot.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-neutral-900 p-8 sm:p-10">
                <p className="text-4xl font-extrabold text-amber-500/30">{item.step}</p>
                <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 - FEATURED CONTRACTORS
          ═══════════════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="border-t border-neutral-800 px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Proven professionals</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Featured contractors</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.tradeSlug}/${c.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="absolute right-4 top-4 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                    {c.tradeName}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    {c.specialties.slice(0, 3).join(" / ")}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-neutral-400">
                    <span>{c.yearsInBusiness} yrs</span>
                    {c.avgRating !== null && (
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400">{"*".repeat(Math.round(c.avgRating))}</span>
                        <span className="text-xs">({c.reviewCount})</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                    View profile
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 - CITIES GRID
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-neutral-800 px-4 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Serving the foothills</p>
          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Your town. Your contractors.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
            From the Roseville flats to the Nevada City pines, we cover the communities that make Gold Country home.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="group rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-4 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <p className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{c.name}</p>
                <p className="text-xs text-neutral-500">{c.county} County</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 - FINAL CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-neutral-800 px-4 py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold sm:text-6xl">
            Ready to find
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              the right contractor?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-400">
            Tell us about your project and get connected with vetted, local professionals who know Gold Country.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/request"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-neutral-950 transition-all hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/25 active:scale-[0.98]"
            >
              Start Your Project
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/v2"
              className="inline-flex items-center rounded-xl border border-neutral-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:border-white"
            >
              Browse Trades
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-neutral-800 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-lg font-bold text-white">
                GoldCountry<span className="text-amber-400">.guide</span>
              </p>
              <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                Built by a local. Vetted by the trades.
                <br />
                Keeping the money in Gold Country.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Trades</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {trades.map((t) => (
                  <Link key={t.slug} href={`/${t.slug}`} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {t.namePlural}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Communities</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {cities.map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} GoldCountry.guide. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
