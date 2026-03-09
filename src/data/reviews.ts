import { Review } from "./types";

export const reviews: Review[] = [
  {
    id: "rev-001",
    contractorSlug: "jc-electrical",
    authorName: "Maria T.",
    rating: 5,
    text: "JC Electrical upgraded our panel to support a new EV charger. Professional, on time, and cleaned up perfectly. Highly recommend for any electrical work in Auburn.",
    date: "2025-01-15",
    projectType: "Panel Upgrade",
  },
  {
    id: "rev-002",
    contractorSlug: "sierra-plumbing-co",
    authorName: "Dave R.",
    rating: 4,
    text: "Sierra Plumbing installed a tankless water heater for us. Good work overall and fair pricing. Only minor scheduling delay but they communicated well.",
    date: "2025-02-20",
    projectType: "Water Heater Installation",
  },
  {
    id: "rev-003",
    contractorSlug: "jc-electrical",
    authorName: "Tom & Linda K.",
    rating: 5,
    text: "We had our 1960s home completely rewired. JC Electrical handled permits, did clean work through finished walls, and passed inspection first try. Worth every penny.",
    date: "2024-11-08",
    projectType: "Whole-Home Rewire",
  },
];

// ─── Query helpers ──────────────────────────────────────────────

export function getReviewsByContractor(contractorSlug: string): Review[] {
  return reviews.filter((r) => r.contractorSlug === contractorSlug);
}

export function getAverageRating(contractorSlug: string): number | null {
  const contractorReviews = getReviewsByContractor(contractorSlug);
  if (contractorReviews.length === 0) return null;
  const sum = contractorReviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / contractorReviews.length) * 10) / 10;
}

export function getReviewCount(contractorSlug: string): number {
  return reviews.filter((r) => r.contractorSlug === contractorSlug).length;
}
