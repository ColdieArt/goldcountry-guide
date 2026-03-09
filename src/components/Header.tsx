import Link from "next/link";

const navTrades = [
  { slug: "general-contractors", label: "General Contractors" },
  { slug: "architects", label: "Architects" },
  { slug: "tree-service", label: "Tree Services" },
  { slug: "concrete-contractors", label: "Concrete" },
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
        </nav>
      </div>
    </header>
  );
}
