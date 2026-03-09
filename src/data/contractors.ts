import { Contractor } from "./types";

export const contractors: Contractor[] = [
  {
    slug: "jc-electrical",
    name: "JC Electrical",
    tradeSlug: "electricians",
    citySlugs: ["auburn", "newcastle", "loomis", "rocklin"],
    phone: "(530) 555-0101",
    website: "https://jcelectrical.example.com",
    description:
      "JC Electrical has been serving Auburn and the surrounding Gold Country foothills for over 15 years. Specializing in residential electrical work including panel upgrades, EV charger installations, and whole-home rewiring.",
    specialties: ["Panel Upgrades", "EV Chargers", "Whole-Home Rewiring"],
    yearsInBusiness: 15,
    licensed: true,
    licenseNumber: "C10-123456",
    membershipStatus: "featured",
    active: true,
    featuredProjectSlugs: ["panel-upgrade-smith-auburn"],
  },
  {
    slug: "sierra-plumbing-co",
    name: "Sierra Plumbing Co.",
    tradeSlug: "plumbers",
    citySlugs: ["auburn", "rocklin", "roseville", "loomis"],
    phone: "(530) 555-0202",
    website: "https://sierraplumbing.example.com",
    description:
      "Sierra Plumbing Co. provides reliable plumbing services throughout Placer County. From emergency repairs to full repiping, their team handles jobs of all sizes.",
    specialties: ["Water Heaters", "Repiping", "Emergency Repairs"],
    yearsInBusiness: 10,
    licensed: true,
    licenseNumber: "C36-789012",
    membershipStatus: "premium",
    active: true,
    featuredProjectSlugs: ["tankless-heater-jones-auburn"],
  },
  {
    slug: "gold-country-roofing",
    name: "Gold Country Roofing",
    tradeSlug: "roofers",
    citySlugs: ["auburn", "grass-valley", "nevada-city", "newcastle"],
    phone: "(530) 555-0303",
    description:
      "Gold Country Roofing specializes in roof replacements and repairs for homes in the Sierra foothills. Experienced with composition shingle, tile, and metal roofing systems.",
    specialties: ["Roof Replacement", "Tile Roofing", "Storm Damage Repair"],
    yearsInBusiness: 8,
    licensed: true,
    licenseNumber: "C39-345678",
    membershipStatus: "free",
    active: true,
  },
];

// ─── Query helpers ──────────────────────────────────────────────

/** Only returns active contractors unless includeInactive is true. */
function activeOnly(list: Contractor[], includeInactive = false): Contractor[] {
  return includeInactive ? list : list.filter((c) => c.active);
}

export function getContractorBySlug(slug: string): Contractor | undefined {
  return contractors.find((c) => c.slug === slug);
}

export function getContractorsByTrade(
  tradeSlug: string,
  includeInactive = false
): Contractor[] {
  return activeOnly(
    contractors.filter((c) => c.tradeSlug === tradeSlug),
    includeInactive
  );
}

export function getContractorsByCity(
  citySlug: string,
  includeInactive = false
): Contractor[] {
  return activeOnly(
    contractors.filter((c) => c.citySlugs.includes(citySlug)),
    includeInactive
  );
}

export function getContractorsByTradeAndCity(
  tradeSlug: string,
  citySlug: string,
  includeInactive = false
): Contractor[] {
  return activeOnly(
    contractors.filter(
      (c) => c.tradeSlug === tradeSlug && c.citySlugs.includes(citySlug)
    ),
    includeInactive
  );
}

export function getFeaturedContractors(): Contractor[] {
  return contractors.filter(
    (c) => c.active && c.membershipStatus === "featured"
  );
}
