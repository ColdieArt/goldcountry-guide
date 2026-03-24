// ─── Lead Scoring ───────────────────────────────────────────────
//
// Scores incoming leads 1-10 based on completeness, intent signals,
// and location fit. Used to prioritize contractor notifications.

export interface LeadScoreInput {
  phone: string;
  email: string;
  budget: string;
  timeline: string;
  city: string;
  ownership: string;
  additionalNotes: string;
  preferredContact: string;
}

const CORE_CITIES = [
  "auburn", "grass-valley", "nevada-city", "newcastle",
  "rocklin", "loomis", "roseville",
];

export function scoreLead(input: LeadScoreInput): number {
  let score = 0;

  // Phone provided (+2)
  if (input.phone.replace(/\D/g, "").length >= 10) score += 2;

  // Email provided (+1)
  if (input.email.includes("@")) score += 1;

  // Specific budget selected (+2)
  if (input.budget && input.budget !== "unsure") score += 2;

  // Timeline within 30 days (+2)
  const urgentTimelines = ["emergency", "this-week", "this-month", "1-2-weeks"];
  if (urgentTimelines.includes(input.timeline)) score += 2;

  // Property owner (+1)
  if (input.ownership === "owner") score += 1;

  // Core service area (+1)
  if (CORE_CITIES.includes(input.city)) score += 1;

  // Additional notes provided (+1)
  if (input.additionalNotes.trim().length > 10) score += 1;

  // "Just researching" timeline (-2)
  if (input.timeline === "planning") score -= 2;

  // Budget unsure (-1)
  if (input.budget === "unsure" || !input.budget) score -= 1;

  // Renter without approval (-2)
  if (input.ownership === "renter") score -= 2;

  return Math.max(1, Math.min(10, score));
}

export function getLeadTemperature(score: number): "hot" | "warm" | "cold" {
  if (score >= 8) return "hot";
  if (score >= 5) return "warm";
  return "cold";
}
