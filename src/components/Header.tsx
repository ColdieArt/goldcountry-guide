import Link from "next/link";
import { cities } from "@/data/cities";

const navTrades = [
  { slug: "general-contractors", label: "General Contractors" },
  { slug: "architects", label: "Architects" },
  { slug: "landscape", label: "Landscape" },
  { slug: "concrete-contractors", label: "Concrete" },
  { slug: "hvac", label: "HVAC" },
  { slug: "electricians", label: "Electricians" },
  { slug: "roofers", label: "Roofers" },
  { slug: "plumbers", label: "Plumbers" },
];

export default function Header() {
  return (
    <header>
      {/* City bar */}
      <div className="border-b border-neutral-800 bg-neutral-950">
        <nav
          aria-label="Browse by city"
          className="mx-auto flex max-w-7xl items-center justify-center gap-1 py-2 text-xs font-medium text-neutral-500"
        >
          {cities.map((city, i) => (
            <span key={city.slug} className="flex items-center">
              {i > 0 && <span className="mx-1.5 text-neutral-700">/</span>}
              <Link
                href={`/${city.slug}`}
                className="rounded px-1.5 py-0.5 transition-colors hover:text-amber-400"
              >
                {city.name}
              </Link>
            </span>
          ))}
        </nav>
      </div>

      {/* Main header */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white"
          >
            GoldCountry<span className="text-amber-400">.guide</span>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium text-neutral-400">
            {navTrades.map((trade) => (
              <Link
                key={trade.slug}
                href={`/${trade.slug}`}
                className="hidden transition-colors hover:text-white lg:block"
              >
                {trade.label}
              </Link>
            ))}
            <Link
              href="/request"
              className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
            >
              Get Quotes
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
