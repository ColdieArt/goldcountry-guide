// ─── Core Entities ──────────────────────────────────────────────

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

export type MembershipStatus = "free" | "premium" | "featured";

export interface Contractor {
  slug: string;
  name: string;
  tradeSlug: string;
  citySlugs: string[];
  phone: string;
  website?: string;
  description: string;
  specialties: string[];
  yearsInBusiness: number;
  licensed: boolean;
  licenseNumber?: string;
  membershipStatus: MembershipStatus;
  active: boolean;
  featuredProjectSlugs?: string[];
}

// ─── Reviews ────────────────────────────────────────────────────

export interface Review {
  id: string;
  contractorSlug: string;
  authorName: string;
  rating: number; // 1–5
  text: string;
  date: string; // ISO date string
  projectType?: string;
}

// ─── Cost Guides ────────────────────────────────────────────────

export interface CostGuide {
  slug: string;
  title: string;
  tradeSlug: string;
  description: string;
  lowEstimate: number;
  highEstimate: number;
  factors: string[];
  lastUpdated: string; // ISO date string
}

// ─── Projects (completed work showcases) ────────────────────────

export interface Project {
  slug: string;
  title: string;
  tradeSlug: string;
  contractorSlug: string;
  description: string;
  completedDate: string; // ISO date string
  citySlug: string;
  images?: string[]; // future: paths or URLs
}
