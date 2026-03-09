import Link from "next/link";

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

const navBuildingOptions = [
  { slug: "custom-home", label: "Custom Home" },
  { slug: "adu", label: "ADU" },
  { slug: "remodel", label: "Remodel" },
  { slug: "ada", label: "ADA" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
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
          <span className="hidden text-gray-300 sm:block">|</span>
          {navBuildingOptions.map((option) => (
            <Link
              key={option.slug}
              href={`/${option.slug}`}
              className="hidden hover:text-gray-600 sm:block"
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
