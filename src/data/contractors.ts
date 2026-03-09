import { Contractor } from "./types";

export const contractors: Contractor[] = [
  {
    slug: "jc-electrical",
    name: "JC Electrical",
    tradeSlug: "electricians",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "loomis", active: true },
      { citySlug: "rocklin", active: true },
    ],
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
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "rocklin", active: true },
      { citySlug: "roseville", active: true },
      { citySlug: "loomis", active: true },
    ],
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
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
      { citySlug: "nevada-city", active: true },
      { citySlug: "newcastle", active: true },
    ],
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

// ─── City coverage helpers ──────────────────────────────────────

/**
 * Returns city slugs where a contractor has active coverage.
 * Inactive contractors get NO discovery presence — returns [].
 */
export function getActiveCitySlugs(contractor: Contractor): string[] {
  if (!contractor.active) return [];
  return [
    contractor.primaryCitySlug,
    ...contractor.additionalCities
      .filter((c) => c.active)
      .map((c) => c.citySlug),
  ];
}

/**
 * Returns ALL city slugs (active + inactive coverage).
 * Used on the contractor's own profile page to show full service area.
 */
export function getAllCitySlugsForContractor(contractor: Contractor): string[] {
  return [
    contractor.primaryCitySlug,
    ...contractor.additionalCities.map((c) => c.citySlug),
  ];
}

/**
 * Checks if a contractor has active coverage in a specific city.
 * Both the membership AND the city-level coverage must be active.
 */
export function hasCityCoverage(
  contractor: Contractor,
  citySlug: string
): boolean {
  if (!contractor.active) return false;
  if (contractor.primaryCitySlug === citySlug) return true;
  return contractor.additionalCities.some(
    (c) => c.citySlug === citySlug && c.active
  );
}

// ─── Query helpers ──────────────────────────────────────────────

/** Only returns active contractors unless includeInactive is true. */
function activeOnly(list: Contractor[], includeInactive = false): Contractor[] {
  return includeInactive ? list : list.filter((c) => c.active);
}

/** Returns a contractor by slug regardless of active status (for profile pages). */
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

/**
 * Returns contractors with active coverage in a given city.
 * Respects both membership active status AND per-city coverage.
 */
export function getContractorsByCity(
  citySlug: string,
  includeInactive = false
): Contractor[] {
  if (includeInactive) {
    return contractors.filter((c) =>
      getAllCitySlugsForContractor(c).includes(citySlug)
    );
  }
  return contractors.filter((c) => hasCityCoverage(c, citySlug));
}

/**
 * Returns contractors matching trade AND active city coverage.
 */
export function getContractorsByTradeAndCity(
  tradeSlug: string,
  citySlug: string,
  includeInactive = false
): Contractor[] {
  if (includeInactive) {
    return contractors.filter(
      (c) =>
        c.tradeSlug === tradeSlug &&
        getAllCitySlugsForContractor(c).includes(citySlug)
    );
  }
  return contractors.filter(
    (c) => c.tradeSlug === tradeSlug && hasCityCoverage(c, citySlug)
  );
}

export function getFeaturedContractors(): Contractor[] {
  return contractors.filter(
    (c) => c.active && c.membershipStatus === "featured"
  );
}
