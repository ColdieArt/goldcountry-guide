import Link from "next/link";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";

export default function Footer() {
  return (
    <footer className="border-t border-amber-200 bg-amber-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-bold text-amber-900">GoldCountry.guide</h3>
            <p className="mt-2 text-sm text-amber-700/70">
              Helping Sierra foothills homeowners find trusted local contractors.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-900">Trades</h4>
            <ul className="mt-2 space-y-1">
              {trades.map((trade) => (
                <li key={trade.slug}>
                  <Link
                    href={`/${trade.slug}`}
                    className="text-sm text-amber-700/70 hover:text-amber-700"
                  >
                    {trade.namePlural}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-900">Cities</h4>
            <ul className="mt-2 space-y-1">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="text-sm text-amber-700/70 hover:text-amber-700"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-amber-200 pt-6 text-center text-xs text-amber-700/50">
          &copy; {new Date().getFullYear()} GoldCountry.guide. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
