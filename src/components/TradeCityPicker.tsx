"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface ContractorInfo {
  slug: string;
  name: string;
  tradeSlug: string;
  specialties: string[];
  yearsInBusiness: number;
  licensed: boolean;
  membershipStatus: string;
  phone: string;
  description: string;
  avgRating: number | null;
  reviewCount: number;
}

interface CityOption {
  slug: string;
  name: string;
  county: string;
  contractorCount: number;
  contractors: ContractorInfo[];
}

export default function TradeCityPicker({
  tradeSlug,
  tradeName,
  tradeNamePlural,
  cities,
}: {
  tradeSlug: string;
  tradeName: string;
  tradeNamePlural: string;
  cities: CityOption[];
}) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const selected = cities.find((c) => c.slug === selectedCity);

  useEffect(() => {
    if (selectedCity && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCity]);

  return (
    <div>
      {/* City Selection */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8">
          <h2 className="text-center text-2xl font-bold text-white">
            Where do you need a {tradeName.toLowerCase()}?
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {cities.map((city) => {
              const isSelected = selectedCity === city.slug;
              const hasContractors = city.contractorCount > 0;
              return (
                <button
                  key={city.slug}
                  onClick={() => setSelectedCity(isSelected ? null : city.slug)}
                  disabled={!hasContractors}
                  className={`
                    rounded-lg px-5 py-3 text-sm font-semibold transition-all
                    ${isSelected
                      ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/25 scale-105"
                      : hasContractors
                        ? "border border-neutral-700 text-neutral-300 hover:border-amber-500/50 hover:text-white hover:shadow"
                        : "border border-neutral-800 text-neutral-600 cursor-not-allowed"
                    }
                  `}
                >
                  {city.name}
                  {hasContractors && (
                    <span className={`ml-2 text-xs ${isSelected ? "text-neutral-800" : "text-neutral-500"}`}>
                      ({city.contractorCount})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image placeholder */}
        <div className="hidden rounded-2xl bg-neutral-800 lg:block" />
      </div>

      {/* Contractor Results */}
      {selected && selected.contractors.length > 0 && (
        <div ref={resultsRef} className="mt-8">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white">
              {tradeNamePlural} in {selected.name}
            </h3>
            <span className="text-sm text-neutral-500">
              {selected.contractors.length} result{selected.contractors.length !== 1 && "s"}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {selected.contractors.map((c) => (
              <Link
                key={c.slug}
                href={`/${tradeSlug}/${c.slug}`}
                className="group block rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {c.name}
                      </h4>
                      {c.membershipStatus !== "free" && (
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-amber-400">
                          {c.membershipStatus}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      {c.specialties.join(" / ")}
                    </p>
                    <p className="mt-2 text-sm text-neutral-400 line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    {c.phone && (
                      <p className="text-sm font-medium text-neutral-300">{c.phone}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                  {c.avgRating !== null && (
                    <span>
                      <span className="text-amber-400">{"*".repeat(Math.round(c.avgRating))}</span>
                      {" "}
                      <span className="text-xs">({c.reviewCount})</span>
                    </span>
                  )}
                  {c.licensed && (
                    <span className="font-medium text-neutral-300">Licensed</span>
                  )}
                  <span>{c.yearsInBusiness} yrs experience</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/request"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-neutral-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
            >
              Request Free Quotes from {tradeNamePlural} in {selected.name}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
