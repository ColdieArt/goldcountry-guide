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
    costTiers: [
      {
        label: "Basic (100A to 100A)",
        lowPrice: 1500,
        highPrice: 2200,
        description:
          "Replacing an existing 100A panel with a modern 100A panel. Suitable for smaller homes without heavy electrical loads.",
      },
      {
        label: "Standard (100A to 200A)",
        lowPrice: 2200,
        highPrice: 3500,
        description:
          "The most common upgrade. Supports modern appliances, EV chargers, and heat pumps. Includes new meter base and utility coordination.",
      },
      {
        label: "Heavy-Duty (200A to 400A)",
        lowPrice: 3500,
        highPrice: 4000,
        description:
          "For large homes, workshops, or properties with multiple sub-panels. Requires utility service upgrade and typically a new meter base.",
      },
    ],
    factors: [
      "Amperage (100A vs 200A vs 400A)",
      "Permits and inspection fees",
      "Age and condition of existing wiring",
      "Accessibility of panel location",
    ],
    localContext:
      "Many Gold Country homes were built in the 1970s–1990s with 100A panels that struggle with modern loads. Auburn and surrounding foothill communities typically require Placer County permits, which add $200–$400 to the total. Homes on well pumps may need additional circuits factored in.",
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
    costTiers: [
      {
        label: "Asphalt Shingle",
        lowPrice: 8000,
        highPrice: 14000,
        description:
          "30-year architectural shingles. Most affordable option. Works well in the foothill climate and handles moderate snow loads.",
      },
      {
        label: "Metal Roofing",
        lowPrice: 12000,
        highPrice: 20000,
        description:
          "Standing seam or corrugated metal. Excellent fire resistance — important in WUI zones. 40–60 year lifespan.",
      },
      {
        label: "Tile Roofing",
        lowPrice: 18000,
        highPrice: 25000,
        description:
          "Concrete or clay tile. Premium durability and aesthetics. Requires structural verification for older Gold Country homes.",
      },
    ],
    factors: [
      "Roof size (square footage)",
      "Material choice (asphalt, tile, metal)",
      "Roof pitch and complexity",
      "Tear-off and disposal of old roof",
    ],
    localContext:
      "Gold Country sits in a Wildland-Urban Interface (WUI) zone where fire-resistant roofing materials can reduce insurance premiums. Many foothill homes have steep roof pitches that increase labor costs. Pine needle and oak leaf debris means proper flashing and ventilation are critical for roof longevity in the Sierra foothills.",
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
