export interface City {
  slug: string;
  name: string;
  county: string;
  description: string;
}

export interface Trade {
  slug: string;
  name: string;
  namePlural: string;
  description: string;
}

export interface Contractor {
  slug: string;
  name: string;
  tradeSlug: string;
  citySlugs: string[];
  phone: string;
  description: string;
  yearsInBusiness: number;
  licensed: boolean;
  licenseNumber?: string;
}
