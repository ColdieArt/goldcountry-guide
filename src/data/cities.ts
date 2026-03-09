import { City } from "./types";

export const cities: City[] = [
  {
    slug: "auburn",
    name: "Auburn",
    county: "Placer",
    description:
      "Auburn is a historic Gold Rush town in the Sierra Nevada foothills, known for its charming Old Town, outdoor recreation, and growing community of skilled contractors.",
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return cities.map((c) => c.slug);
}
