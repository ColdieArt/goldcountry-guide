"use server";

import { routeLead, classifyBudget } from "@/lib/lead-routing";
import { contractors } from "@/data/contractors";

export interface SimulationResult {
  contractorName: string;
  contractorSlug: string;
  score: number;
  premiumLevel: string;
  earlyAccess: boolean;
  membershipStatus: string;
  primaryCity: string;
}

export interface SimulationOutput {
  matches: SimulationResult[];
  budgetTier: string;
  totalContractors: number;
}

export async function simulateLeadRouting(
  tradeSlug: string,
  citySlug: string,
  budgetValue: string
): Promise<SimulationOutput> {
  const matches = routeLead(
    {
      tradeSlug,
      citySlug,
      budgetValue,
      submittedAt: new Date().toISOString(),
    },
    contractors
  );

  return {
    matches: matches.map((m) => ({
      contractorName: m.contractor.name,
      contractorSlug: m.contractor.slug,
      score: m.score,
      premiumLevel: m.premiumLevel,
      earlyAccess: m.earlyAccess,
      membershipStatus: m.contractor.membershipStatus,
      primaryCity: m.contractor.primaryCitySlug,
    })),
    budgetTier: classifyBudget(budgetValue) ?? "unknown",
    totalContractors: contractors.length,
  };
}
