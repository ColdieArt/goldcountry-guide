import { BuildingOption } from "./types";

export const buildingOptions: BuildingOption[] = [
  {
    slug: "custom-home",
    name: "Custom Home",
    description:
      "Ground-up custom home construction tailored to your lot, lifestyle, and budget.",
  },
  {
    slug: "adu",
    name: "ADU",
    description:
      "Accessory dwelling units including detached cottages, garage conversions, and junior ADUs.",
  },
  {
    slug: "remodel",
    name: "Remodel",
    description:
      "Kitchen, bathroom, and whole-home remodels to modernize and add value to your property.",
  },
  {
    slug: "ada",
    name: "ADA",
    description:
      "ADA-compliant modifications including ramps, grab bars, walk-in showers, and doorway widening.",
  },
];

export function getBuildingOptionBySlug(
  slug: string,
): BuildingOption | undefined {
  return buildingOptions.find((b) => b.slug === slug);
}

export function getAllBuildingOptionSlugs(): string[] {
  return buildingOptions.map((b) => b.slug);
}
