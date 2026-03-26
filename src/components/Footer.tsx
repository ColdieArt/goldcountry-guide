"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";

export default function Footer() {
  const pathname = usePathname();

  // Homepage has its own footer - don't render the standard one
  if (pathname === "/" || pathname === "/v2") return null;

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-white">
              GoldCountry<span className="text-amber-400">.guide</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Built by a local. Vetted by the trades.
              <br />
              Keeping the money in Gold Country.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Trades</p>
            <ul className="mt-3 space-y-1">
              {trades.map((trade) => (
                <li key={trade.slug}>
                  <Link
                    href={`/${trade.slug}`}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {trade.namePlural}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Communities</p>
            <ul className="mt-3 space-y-1">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-600">
          <p>&copy; {new Date().getFullYear()} GoldCountry.guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
