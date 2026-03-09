export interface CostGuide {
  slug: string;
  title: string;
  tradeSlug: string;
  description: string;
  lowEstimate: number;
  highEstimate: number;
}

export const costGuides: CostGuide[] = [
  {
    slug: "electrical-panel-upgrade-cost",
    title: "Electrical Panel Upgrade Cost",
    tradeSlug: "electricians",
    description:
      "How much does an electrical panel upgrade cost in the Auburn area? Typical costs, what affects pricing, and how to get the best value.",
    lowEstimate: 1500,
    highEstimate: 4000,
  },
  {
    slug: "roof-replacement-cost",
    title: "Roof Replacement Cost",
    tradeSlug: "roofers",
    description:
      "What does a roof replacement cost in Gold Country? Factors that affect pricing for common roofing materials in the Sierra foothills.",
    lowEstimate: 8000,
    highEstimate: 25000,
  },
  {
    slug: "tree-removal-cost",
    title: "Tree Removal Cost",
    tradeSlug: "tree-service",
    description:
      "How much does tree removal cost in Auburn and the foothills? Pricing for pine, oak, and large tree removal.",
    lowEstimate: 500,
    highEstimate: 3000,
  },
];

export function getCostGuideBySlug(slug: string): CostGuide | undefined {
  return costGuides.find((g) => g.slug === slug);
}

export function getAllCostGuideSlugs(): string[] {
  return costGuides.map((g) => g.slug);
}
