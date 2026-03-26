"use client";

import { useState } from "react";
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

  const activeCities = cities.filter((c) => c.contractorCount > 0);
  const selected = cities.find((c) => c.slug === selectedCity);

  return (
    <div>
      {/* ── City Selection CTA + Image ────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border-2 border-amber-400/60 bg-amber-50/50 p-6 sm:p-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">
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
                      ? "bg-gray-900 text-white shadow-lg scale-105"
                      : hasContractors
                        ? "border border-gray-300 bg-white text-gray-900 hover:border-gray-500 hover:bg-gray-50 hover:shadow"
                        : "border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {city.name}
                  {hasContractors && (
                    <span className={`ml-2 text-xs ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                      ({city.contractorCount})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image placeholder */}
        <div className="hidden rounded-xl bg-gray-200 lg:block" />
      </div>

      {/* ── Contractor Results ──────────────────────────────────── */}
      {selected && selected.contractors.length > 0 && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {tradeNamePlural} in {selected.name}
            </h3>
            <span className="text-sm text-gray-500">
              {selected.contractors.length} result{selected.contractors.length !== 1 && "s"}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {selected.contractors.map((c) => (
              <Link
                key={c.slug}
                href={`/${tradeSlug}/${c.slug}`}
                className="block rounded-lg border border-gray-200 p-5 transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {c.name}
                      </h4>
                      {c.membershipStatus !== "free" && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium capitalize text-amber-800">
                          {c.membershipStatus}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-700/70">
                      {c.specialties.join(" · ")}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    {c.phone && (
                      <p className="text-sm font-medium text-gray-900">{c.phone}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  {c.avgRating !== null && (
                    <span>
                      {"★".repeat(Math.round(c.avgRating))}
                      {"☆".repeat(5 - Math.round(c.avgRating))}{" "}
                      <span className="text-xs">({c.reviewCount})</span>
                    </span>
                  )}
                  {c.licensed && (
                    <span className="font-medium text-gray-700">Licensed</span>
                  )}
                  <span>{c.yearsInBusiness} yrs experience</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/request"
              className="inline-block rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Request Free Quotes from {tradeNamePlural} in {selected.name}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
