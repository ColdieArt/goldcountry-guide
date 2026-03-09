import Link from "next/link";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";

export default function Header() {
  return (
    <header className="border-b border-amber-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-amber-900"
        >
          GoldCountry.guide
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-amber-800">
          {cities.slice(0, 3).map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="hidden hover:text-amber-600 md:block"
            >
              {city.name}
            </Link>
          ))}
          {trades.slice(0, 3).map((trade) => (
            <Link
              key={trade.slug}
              href={`/${trade.slug}`}
              className="hidden hover:text-amber-600 sm:block"
            >
              {trade.namePlural}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
