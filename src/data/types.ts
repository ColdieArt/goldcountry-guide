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

export interface CityCoverage {
  citySlug: string;
  active: boolean; // false = purchased but paused/expired
}

export interface Contractor {
  slug: string;
  name: string;
  tradeSlug: string;
  primaryCitySlug: string;             // included with base membership
  additionalCities: CityCoverage[];    // purchased add-ons
  phone: string;
  website?: string;
  description: string;
  specialties: string[];
  yearsInBusiness: number;
  licensed: boolean;
  licenseNumber?: string;
  membershipStatus: MembershipStatus;
  active: boolean;                     // false = membership lapsed
  featuredProjectSlugs?: string[];
  leadPreferences?: LeadPreferences;   // absent = not opted in to leads
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

export interface CostTier {
  label: string;         // e.g. "Basic", "Mid-Range", "High-End"
  lowPrice: number;
  highPrice: number;
  description: string;   // what's included at this tier
}

export interface CostGuide {
  slug: string;
  title: string;
  tradeSlug: string;
  description: string;
  lowEstimate: number;
  highEstimate: number;
  costTiers: CostTier[];           // breakdown by project scope
  factors: string[];
  localContext: string;            // Gold Country-specific pricing note
  lastUpdated: string;             // ISO date string
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

// ─── Lead Routing ────────────────────────────────────────────────

/**
 * Budget tiers map form-submitted budget ranges to a normalized tier.
 * Used to match leads against contractor preferences.
 */
export type BudgetTier = "small" | "medium" | "large" | "enterprise";

/**
 * Premium level controls lead access priority.
 *   standard  — receives leads after premium window expires
 *   premium   — gets early-access / first-look window on matching leads
 */
export type PremiumLevel = "standard" | "premium";

/**
 * Per-contractor lead preferences.
 * Stored on the Contractor record; consumed by the lead-routing engine.
 */
export interface LeadPreferences {
  premiumLevel: PremiumLevel;
  acceptedBudgetTiers: BudgetTier[];  // which tiers this contractor wants
  maxLeadsPerMonth?: number;          // optional cap (future billing)
}
