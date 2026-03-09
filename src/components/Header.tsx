import Link from "next/link";
import { trades } from "@/data/trades";

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
          <Link href="/auburn" className="hover:text-amber-600">
            Auburn
          </Link>
          {trades.slice(0, 4).map((trade) => (
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
