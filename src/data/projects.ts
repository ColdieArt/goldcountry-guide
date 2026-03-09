import { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "panel-upgrade-smith-auburn",
    title: "200A Panel Upgrade — Smith Residence",
    tradeSlug: "electricians",
    contractorSlug: "jc-electrical",
    description:
      "Upgraded a 1970s 100-amp panel to a modern 200-amp system to support EV charging, a heat pump, and future solar. Included new grounding and bonding to current code.",
    completedDate: "2025-01-10",
    citySlug: "auburn",
  },
  {
    slug: "tankless-heater-jones-auburn",
    title: "Tankless Water Heater Install — Jones Home",
    tradeSlug: "plumbers",
    contractorSlug: "sierra-plumbing-co",
    description:
      "Replaced an aging 40-gallon tank water heater with a high-efficiency tankless unit. Included gas line resizing and venting modifications.",
    completedDate: "2025-02-18",
    citySlug: "auburn",
  },
];

// ─── Query helpers ──────────────────────────────────────────────

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function getProjectsByContractor(contractorSlug: string): Project[] {
  return projects.filter((p) => p.contractorSlug === contractorSlug);
}

export function getProjectsByTrade(tradeSlug: string): Project[] {
  return projects.filter((p) => p.tradeSlug === tradeSlug);
}

export function getProjectsByCity(citySlug: string): Project[] {
  return projects.filter((p) => p.citySlug === citySlug);
}
