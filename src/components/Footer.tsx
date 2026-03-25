import Link from "next/link";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50" aria-label="Site footer">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-bold text-gray-900">GoldCountry.guide</p>
            <p className="mt-2 text-sm text-gray-700/70">
              Helping Sierra foothills homeowners find trusted local contractors.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Trades</p>
            <ul className="mt-2 space-y-1">
              {trades.map((trade) => (
                <li key={trade.slug}>
                  <Link
                    href={`/${trade.slug}`}
                    className="text-sm text-gray-700/70 hover:text-gray-700"
                  >
                    {trade.namePlural}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Cities</p>
            <ul className="mt-2 space-y-1">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="text-sm text-gray-700/70 hover:text-gray-700"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-700/50">
          <p>&copy; {new Date().getFullYear()} GoldCountry.guide. All rights reserved.</p>
          <p className="mt-1">Serving California&apos;s Gold Country since 2024.</p>
        </div>
      </div>
    </footer>
  );
}
