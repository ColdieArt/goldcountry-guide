import { trades } from "@/data/trades";
import { cities } from "@/data/cities";
import { contractors, getFeaturedContractors, getContractorsByTrade } from "@/data/contractors";
import { getAverageRating, getReviewCount } from "@/data/reviews";
import { getTradeBySlug } from "@/data/trades";
import HomeV2 from "@/components/HomeV2";

const TRADE_ICONS: Record<string, string> = {
  electricians: "⚡",
  plumbers: "🔧",
  roofers: "🏠",
  hvac: "❄️",
  landscape: "🌿",
  "general-contractors": "🏗️",
  "concrete-contractors": "🧱",
  architects: "📐",
};

export default function Home() {
  const featured = getFeaturedContractors();

  const tradeData = trades.map((t) => ({
    slug: t.slug,
    name: t.name,
    namePlural: t.namePlural,
    description: t.description,
    contractorCount: getContractorsByTrade(t.slug).length,
    icon: TRADE_ICONS[t.slug] ?? "🔨",
  }));

  const cityData = cities.map((c) => ({
    slug: c.slug,
    name: c.name,
    county: c.county,
  }));

  const featuredData = featured.map((c) => ({
    slug: c.slug,
    name: c.name,
    tradeSlug: c.tradeSlug,
    tradeName: getTradeBySlug(c.tradeSlug)?.namePlural ?? c.tradeSlug,
    specialties: c.specialties,
    yearsInBusiness: c.yearsInBusiness,
    avgRating: getAverageRating(c.slug),
    reviewCount: getReviewCount(c.slug),
  }));

  return (
    <div className="homepage-standalone">
      <HomeV2
        trades={tradeData}
        cities={cityData}
        featured={featuredData}
        totalContractors={contractors.length}
        totalCities={cities.length}
      />
    </div>
  );
}
