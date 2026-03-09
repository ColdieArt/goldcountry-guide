import type { Metadata } from "next";
import LeadSimulator from "./LeadSimulator";
import { trades } from "@/data/trades";
import { cities } from "@/data/cities";

export const metadata: Metadata = {
  title: "Lead Routing Simulator",
  robots: "noindex, nofollow",
};

export default function AdminLeadsPage() {
  const tradeOptions = trades.map((t) => ({ slug: t.slug, name: t.name }));
  const cityOptions = cities.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">
        Lead Routing Simulator
      </h1>
      <p className="mt-2 text-sm text-gray-700/60">
        Test how incoming project requests are matched to contractors.
      </p>
      <LeadSimulator trades={tradeOptions} cities={cityOptions} />
    </div>
  );
}
