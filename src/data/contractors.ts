import { Contractor } from "./types";

export const contractors: Contractor[] = [
  {
    slug: "jc-electrical",
    name: "JC Electrical",
    tradeSlug: "electricians",
    citySlugs: ["auburn", "grass-valley"],
    phone: "(530) 555-0101",
    description:
      "JC Electrical has been serving Auburn and the surrounding Gold Country foothills for over 15 years. Specializing in residential electrical work including panel upgrades, EV charger installations, and whole-home rewiring.",
    yearsInBusiness: 15,
    licensed: true,
    licenseNumber: "C10-123456",
  },
  {
    slug: "sierra-plumbing-co",
    name: "Sierra Plumbing Co.",
    tradeSlug: "plumbers",
    citySlugs: ["auburn"],
    phone: "(530) 555-0202",
    description:
      "Sierra Plumbing Co. provides reliable plumbing services throughout Placer County. From emergency repairs to full repiping, their team handles jobs of all sizes.",
    yearsInBusiness: 10,
    licensed: true,
    licenseNumber: "C36-789012",
  },
];

export function getContractorBySlug(slug: string): Contractor | undefined {
  return contractors.find((c) => c.slug === slug);
}

export function getContractorsByTrade(tradeSlug: string): Contractor[] {
  return contractors.filter((c) => c.tradeSlug === tradeSlug);
}

export function getContractorsByCity(citySlug: string): Contractor[] {
  return contractors.filter((c) => c.citySlugs.includes(citySlug));
}

export function getContractorsByTradeAndCity(
  tradeSlug: string,
  citySlug: string
): Contractor[] {
  return contractors.filter(
    (c) => c.tradeSlug === tradeSlug && c.citySlugs.includes(citySlug)
  );
}
