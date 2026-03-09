// ─── Lead Routing Engine ─────────────────────────────────────────
//
// Matches incoming project requests to eligible contractors based on:
//   1. Trade match
//   2. Active city coverage
//   3. Budget tier acceptance
//   4. Premium level (first-look window)
//
// This module is pure logic — no UI, no billing, no persistence.
// Future billing/invoicing hooks into the LeadMatch output.

import type { BudgetTier, Contractor, PremiumLevel } from "@/data/types";
import { hasCityCoverage } from "@/data/contractors";

// ─── Budget Tier Classification ─────────────────────────────────

/**
 * Maps the form's budget range value to a normalized tier.
 * "unsure" and empty default to null (match all tiers).
 */
const BUDGET_TIER_MAP: Record<string, BudgetTier> = {
  "under-1k": "small",
  "1k-5k": "small",
  "5k-15k": "medium",
  "15k-50k": "large",
  "50k-plus": "enterprise",
};

export function classifyBudget(budgetValue: string): BudgetTier | null {
  return BUDGET_TIER_MAP[budgetValue] ?? null;
}

// ─── Lead Match Result ──────────────────────────────────────────

export interface LeadMatch {
  contractor: Contractor;
  score: number;              // higher = better match (for ranking)
  premiumLevel: PremiumLevel;
  earlyAccess: boolean;       // true = within first-look window
}

// ─── Eligibility Checks ─────────────────────────────────────────

/**
 * A contractor is eligible for a lead if ALL of these are true:
 *   - membership is active
 *   - trade matches
 *   - has active coverage in the requested city
 *   - has opted in to leads (leadPreferences exists)
 *   - accepts the lead's budget tier (or budget is unknown)
 */
function isEligible(
  contractor: Contractor,
  tradeSlug: string,
  citySlug: string,
  budgetTier: BudgetTier | null
): boolean {
  if (!contractor.active) return false;
  if (contractor.tradeSlug !== tradeSlug) return false;
  if (!hasCityCoverage(contractor, citySlug)) return false;
  if (!contractor.leadPreferences) return false;

  // If budget is unknown, don't filter by tier
  if (budgetTier === null) return true;

  return contractor.leadPreferences.acceptedBudgetTiers.includes(budgetTier);
}

// ─── Scoring ────────────────────────────────────────────────────

/**
 * Score weights for ranking matched contractors.
 * Higher score = shown first / gets lead first.
 */
const SCORE_WEIGHTS = {
  premiumLevel: { premium: 30, standard: 0 } as Record<PremiumLevel, number>,
  membershipStatus: { featured: 20, premium: 10, free: 0 } as Record<string, number>,
  primaryCity: 10,    // bonus if lead is in contractor's primary city
};

function scoreMatch(
  contractor: Contractor,
  citySlug: string
): number {
  const prefs = contractor.leadPreferences!;
  let score = 0;

  score += SCORE_WEIGHTS.premiumLevel[prefs.premiumLevel];
  score += SCORE_WEIGHTS.membershipStatus[contractor.membershipStatus] ?? 0;

  if (contractor.primaryCitySlug === citySlug) {
    score += SCORE_WEIGHTS.primaryCity;
  }

  return score;
}

// ─── Early Access Window ────────────────────────────────────────

/**
 * Premium contractors get a first-look window before standard
 * contractors see the lead. This function determines whether the
 * lead is still within that window.
 *
 * In v1 this is a simple check against lead age.
 * Future: configurable per-contractor or per-trade windows.
 */
const EARLY_ACCESS_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours

export function isWithinEarlyAccessWindow(leadSubmittedAt: string): boolean {
  const elapsed = Date.now() - new Date(leadSubmittedAt).getTime();
  return elapsed < EARLY_ACCESS_WINDOW_MS;
}

// ─── Main Routing Function ──────────────────────────────────────

export interface LeadRoutingInput {
  tradeSlug: string;
  citySlug: string;
  budgetValue: string;       // raw form value, e.g. "5k-15k"
  submittedAt: string;       // ISO timestamp
}

/**
 * Given a project request, returns ranked contractor matches.
 *
 * During the early-access window, only premium contractors are
 * returned. After the window expires, all eligible contractors
 * are returned (premium contractors still rank higher).
 *
 * @param input  - Normalized lead fields
 * @param pool   - Contractors to search (defaults to all)
 * @returns Sorted LeadMatch array, best match first
 */
export function routeLead(
  input: LeadRoutingInput,
  pool: Contractor[]
): LeadMatch[] {
  const budgetTier = classifyBudget(input.budgetValue);
  const earlyAccess = isWithinEarlyAccessWindow(input.submittedAt);

  const matches: LeadMatch[] = [];

  for (const contractor of pool) {
    if (!isEligible(contractor, input.tradeSlug, input.citySlug, budgetTier)) {
      continue;
    }

    const prefs = contractor.leadPreferences!;
    const isPremium = prefs.premiumLevel === "premium";

    // During early-access window, skip standard contractors
    if (earlyAccess && !isPremium) continue;

    matches.push({
      contractor,
      score: scoreMatch(contractor, input.citySlug),
      premiumLevel: prefs.premiumLevel,
      earlyAccess: earlyAccess && isPremium,
    });
  }

  // Sort descending by score
  matches.sort((a, b) => b.score - a.score);

  return matches;
}
