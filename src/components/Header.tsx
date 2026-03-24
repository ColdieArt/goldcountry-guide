import Link from "next/link";
import { cities } from "@/data/cities";

const navTrades = [
  { slug: "general-contractors", label: "General Contractors" },
  { slug: "architects", label: "Architects" },
  { slug: "tree-service", label: "Tree Services" },
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
      <div className="bg-yellow-600 text-white">
        <nav
          aria-label="Browse by city"
          className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-1.5 text-xs font-medium"
        >
          <span className="mr-2 shrink-0 text-yellow-200">Your city:</span>
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="shrink-0 rounded px-2 py-0.5 transition-colors hover:bg-yellow-500"
            >
              {city.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            GoldCountry.guide
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm font-medium text-gray-800">
            {navTrades.map((trade) => (
              <Link
                key={trade.slug}
                href={`/${trade.slug}`}
                className="hidden hover:text-gray-600 sm:block"
              >
                {trade.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
