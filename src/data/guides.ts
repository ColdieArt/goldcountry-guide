import { Guide } from "./types";

export const guides: Guide[] = [];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}

export function getGuidesByCity(citySlug: string): Guide[] {
  return guides.filter((g) => g.citySlug === citySlug);
}

export function getGuidesByTrade(tradeSlug: string): Guide[] {
  return guides.filter((g) => g.tradeSlug === tradeSlug);
}
