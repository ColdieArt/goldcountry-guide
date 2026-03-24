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
  const res = await fetch("/api/submit-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    return { success: false, error: result.error || "Submission failed" };
  }

  return { success: true, id: result.id };
}
