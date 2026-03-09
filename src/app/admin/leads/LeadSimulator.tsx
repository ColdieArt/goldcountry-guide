"use client";

import { useState } from "react";
import {
  simulateLeadRouting,
  type SimulationOutput,
} from "./actions";

const budgetRanges = [
  { label: "Under $1,000", value: "under-1k" },
  { label: "$1,000 – $5,000", value: "1k-5k" },
  { label: "$5,000 – $15,000", value: "5k-15k" },
  { label: "$15,000 – $50,000", value: "15k-50k" },
  { label: "$50,000+", value: "50k-plus" },
  { label: "Not sure yet", value: "unsure" },
];

export default function LeadSimulator({
  trades,
  cities,
}: {
  trades: { slug: string; name: string }[];
  cities: { slug: string; name: string }[];
}) {
  const [trade, setTrade] = useState(trades[0]?.slug ?? "");
  const [city, setCity] = useState(cities[0]?.slug ?? "");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState<SimulationOutput | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSimulate() {
    setLoading(true);
    try {
      const output = await simulateLeadRouting(trade, city, budget);
      setResult(output);
    } finally {
      setLoading(false);
    }
  }

  const selectClass =
    "mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-800";

  return (
    <div className="mt-8">
      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="sim-trade" className={labelClass}>
            Trade
          </label>
          <select
            id="sim-trade"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className={selectClass}
          >
            {trades.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sim-city" className={labelClass}>
            City
          </label>
          <select
            id="sim-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={selectClass}
          >
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sim-budget" className={labelClass}>
            Budget
          </label>
          <select
            id="sim-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={selectClass}
          >
            <option value="">Not sure yet</option>
            {budgetRanges.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSimulate}
        disabled={loading}
        className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Simulating…" : "Simulate Lead Routing"}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-8">
          <div className="flex items-baseline gap-4">
            <h2 className="text-lg font-bold text-gray-900">Results</h2>
            <span className="text-sm text-gray-700/60">
              Budget tier: {result.budgetTier} · {result.totalContractors}{" "}
              contractors in pool
            </span>
          </div>

          {result.matches.length === 0 ? (
            <p className="mt-4 text-sm text-gray-700/60">
              No matching contractors for this combination.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-700/70">
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Contractor</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Premium</th>
                    <th className="px-4 py-2">Early Access</th>
                    <th className="px-4 py-2">Membership</th>
                    <th className="px-4 py-2">Primary City</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.matches.map((m, i) => (
                    <tr key={m.contractorSlug}>
                      <td className="px-4 py-3 text-gray-700/60">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {m.contractorName}
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-800">
                        {m.score}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            m.premiumLevel === "premium"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {m.premiumLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {m.earlyAccess ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-700">
                        {m.membershipStatus}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {m.primaryCity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
