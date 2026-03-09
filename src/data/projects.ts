export interface ProjectType {
  slug: string;
  title: string;
  tradeSlug: string;
  description: string;
}

export const projectTypes: ProjectType[] = [
  {
    slug: "panel-upgrade",
    title: "Electrical Panel Upgrade",
    tradeSlug: "electricians",
    description:
      "Upgrade your home's electrical panel to support modern appliances, EV chargers, and solar systems.",
  },
  {
    slug: "whole-home-rewire",
    title: "Whole-Home Rewire",
    tradeSlug: "electricians",
    description:
      "Replace outdated or unsafe wiring throughout your home to meet current electrical codes.",
  },
  {
    slug: "roof-replacement",
    title: "Roof Replacement",
    tradeSlug: "roofers",
    description:
      "Full roof tear-off and replacement with new materials suited for the Sierra foothills climate.",
  },
  {
    slug: "water-heater-install",
    title: "Water Heater Installation",
    tradeSlug: "plumbers",
    description:
      "Install a new tank or tankless water heater with proper permitting and code compliance.",
  },
];

export function getProjectTypeBySlug(slug: string): ProjectType | undefined {
  return projectTypes.find((p) => p.slug === slug);
}

export function getAllProjectTypeSlugs(): string[] {
  return projectTypes.map((p) => p.slug);
}
