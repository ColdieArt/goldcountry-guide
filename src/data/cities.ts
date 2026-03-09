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
  {
    slug: "rocklin",
    name: "Rocklin",
    county: "Placer",
    description:
      "Rocklin is a fast-growing city in western Placer County with new developments, top-rated schools, and easy access to Sacramento.",
  },
  {
    slug: "newcastle",
    name: "Newcastle",
    county: "Placer",
    description:
      "Newcastle is a small foothill community between Auburn and Rocklin, known for its fruit orchards and rural charm.",
  },
  {
    slug: "loomis",
    name: "Loomis",
    county: "Placer",
    description:
      "Loomis is a family-friendly town in Placer County with a historic downtown, equestrian culture, and a strong sense of community.",
  },
  {
    slug: "roseville",
    name: "Roseville",
    county: "Placer",
    description:
      "Roseville is the largest city in Placer County, offering a thriving economy, major shopping destinations, and diverse housing options.",
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return cities.map((c) => c.slug);
}
