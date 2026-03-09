// ─── Project Request Submission ─────────────────────────────────
//
// v1: in-memory mock. Replace submitProjectRequest() body with
// your backend of choice:
//   - Airtable: POST to Airtable API
//   - Supabase: insert into project_requests table
//   - Email: call Resend / SendGrid / SES
//   - Webhook: POST to Zapier / Make / n8n
//
// The ProjectRequest shape is the contract between the form and
// whatever backend you wire up. Keep it stable.

export interface ProjectRequest {
  projectType: string;
  trade: string;
  city: string;
  description: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  // Future fields:
  // photos?: File[];
  // referralSource?: string;
  submittedAt: string; // ISO timestamp
}

export interface SubmissionResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function submitProjectRequest(
  data: ProjectRequest
): Promise<SubmissionResult> {
  // ── Mock handler ──────────────────────────────────────────────
  // Simulates a short network delay, logs, returns a fake ID.
  // Replace this body with real backend integration.
  await new Promise((resolve) => setTimeout(resolve, 600));

  // In production, validate server-side here before persisting.
  console.log("[submission]", JSON.stringify(data, null, 2));

  return {
    success: true,
    id: `req-${Date.now()}`,
  };
}
