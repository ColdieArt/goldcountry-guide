import { CostGuide } from "./types";

export const costGuides: CostGuide[] = [
  {
    slug: "electrical-panel-upgrade-cost",
    title: "Electrical Panel Upgrade Cost",
    tradeSlug: "electricians",
    description:
      "How much does an electrical panel upgrade cost in the Auburn area? Typical costs, what affects pricing, and how to get the best value.",
    lowEstimate: 1500,
    highEstimate: 4000,
    factors: [
      "Amperage (100A vs 200A vs 400A)",
      "Permits and inspection fees",
      "Age and condition of existing wiring",
      "Accessibility of panel location",
    ],
    lastUpdated: "2025-03-01",
  },
  {
    slug: "roof-replacement-cost",
    title: "Roof Replacement Cost",
    tradeSlug: "roofers",
    description:
      "What does a roof replacement cost in Gold Country? Factors that affect pricing for common roofing materials in the Sierra foothills.",
    lowEstimate: 8000,
    highEstimate: 25000,
    factors: [
      "Roof size (square footage)",
      "Material choice (asphalt, tile, metal)",
      "Roof pitch and complexity",
      "Tear-off and disposal of old roof",
    ],
    lastUpdated: "2025-02-15",
  },
];

// ─── Query helpers ──────────────────────────────────────────────

export function getCostGuideBySlug(slug: string): CostGuide | undefined {
  return costGuides.find((g) => g.slug === slug);
}

export function getAllCostGuideSlugs(): string[] {
  return costGuides.map((g) => g.slug);
}

export function getCostGuidesByTrade(tradeSlug: string): CostGuide[] {
  return costGuides.filter((g) => g.tradeSlug === tradeSlug);
}
