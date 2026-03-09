import { City } from "./types";

export const cities: City[] = [
  {
    slug: "auburn",
    name: "Auburn",
    county: "Placer",
    description:
      "Auburn is a historic Gold Rush town in the Sierra Nevada foothills, known for its charming Old Town, outdoor recreation, and growing community of skilled contractors.",
  },
  {
    slug: "grass-valley",
    name: "Grass Valley",
    county: "Nevada",
    description:
      "Grass Valley blends Gold Rush heritage with a vibrant arts scene, nestled in the Sierra foothills of Nevada County.",
  },
  {
    slug: "nevada-city",
    name: "Nevada City",
    county: "Nevada",
    description:
      "Nevada City is a picturesque mountain town known for its Victorian architecture, creative community, and surrounding forests.",
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return cities.map((c) => c.slug);
}
