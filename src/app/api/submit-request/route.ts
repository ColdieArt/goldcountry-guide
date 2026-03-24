import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "coldieart@gmail.com";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const rows = [
      ["Project Type", data.projectType],
      ["Trade", data.trade],
      ["City", data.city],
      ["Description", data.description],
      ["Budget", data.budget || "Not specified"],
      ["Timeline", data.timeline || "Not specified"],
      ["Name", data.name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Submitted", data.submittedAt],
    ];

    const textBody = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    const htmlBody = `
      <h2>New Project Request</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                <td style="padding:6px 12px;font-weight:bold;border-bottom:1px solid #eee;">${k}</td>
                <td style="padding:6px 12px;border-bottom:1px solid #eee;">${v || "—"}</td>
              </tr>`
          )
          .join("")}
      </table>
    `;

    const { error } = await resend.emails.send({
      from: "Gold Country Guide <onboarding@resend.dev>",
      to: [TO_EMAIL],
      subject: `New Request: ${data.trade} in ${data.city}`,
      html: htmlBody,
      text: textBody,
      replyTo: data.email,
    });

    if (error) {
      console.error("[email-error]", error);
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: `req-${Date.now()}` });
  } catch (err) {
    console.error("[submit-request]", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
