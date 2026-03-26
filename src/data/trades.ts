import { Trade } from "./types";

export const trades: Trade[] = [
  {
    slug: "electricians",
    name: "Electrician",
    namePlural: "Electricians",
    description:
      "Licensed electricians for residential wiring, panel upgrades, EV charger installation, and electrical repairs.",
  },
  {
    slug: "plumbers",
    name: "Plumber",
    namePlural: "Plumbers",
    description:
      "Licensed plumbers for water heater installation, leak repair, repiping, and drain cleaning.",
  },
  {
    slug: "roofers",
    name: "Roofer",
    namePlural: "Roofers",
    description:
      "Roofing contractors for roof replacement, repair, inspection, and gutter installation.",
  },
  {
    slug: "hvac",
    name: "HVAC Technician",
    namePlural: "HVAC Contractors",
    description:
      "Heating and cooling specialists for AC installation, furnace repair, and ductwork.",
  },
  {
    slug: "landscape",
    name: "Landscape Professional",
    namePlural: "Landscape",
    description:
      "Landscape professionals for design, installation, maintenance, tree care, and outdoor living spaces.",
  },
  {
    slug: "general-contractors",
    name: "General Contractor",
    namePlural: "General Contractors",
    description:
      "Licensed general contractors for home remodels, additions, new construction, and project management.",
  },
  {
    slug: "concrete-contractors",
    name: "Concrete Contractor",
    namePlural: "Concrete Contractors",
    description:
      "Concrete specialists for driveways, patios, foundations, retaining walls, and decorative concrete.",
  },
  {
    slug: "architects",
    name: "Architect",
    namePlural: "Architects",
    description:
      "Licensed architects for residential design, remodel planning, blueprints, and permitting assistance.",
  },
];

export function getTradeBySlug(slug: string): Trade | undefined {
  return trades.find((t) => t.slug === slug);
}

export function getAllTradeSlugs(): string[] {
  return trades.map((t) => t.slug);
}
