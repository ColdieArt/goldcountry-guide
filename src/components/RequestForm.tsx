"use client";

import { useState } from "react";
import Link from "next/link";
import {
  submitProjectRequest,
  type ProjectRequest,
} from "@/lib/submissions";

// ─── Props ──────────────────────────────────────────────────────

interface RequestFormProps {
  trades: { slug: string; name: string }[];
  cities: { slug: string; name: string }[];
  /** Prefill values from QuickStart or URL params */
  prefill?: {
    projectType?: string;
    trade?: string;
    city?: string;
    timeline?: string;
  };
}

// ─── Constants ──────────────────────────────────────────────────

const budgetRanges = [
  { label: "Under $1,000", value: "under-1k" },
  { label: "$1,000 – $5,000", value: "1k-5k" },
  { label: "$5,000 – $15,000", value: "5k-15k" },
  { label: "$15,000 – $50,000", value: "15k-50k" },
  { label: "$50,000+", value: "50k-plus" },
  { label: "Not sure yet", value: "unsure" },
];

const timelineOptions = [
  { label: "Emergency", value: "emergency" },
  { label: "This week", value: "this-week" },
  { label: "This month", value: "this-month" },
  { label: "Within 3 months", value: "3-months" },
  { label: "Just planning", value: "planning" },
];

// ─── Component ──────────────────────────────────────────────────

export default function RequestForm({
  trades,
  cities,
  prefill,
}: RequestFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const data: ProjectRequest = {
      projectType: (fd.get("projectType") as string) || "",
      trade: (fd.get("trade") as string) || "",
      city: (fd.get("city") as string) || "",
      description: (fd.get("description") as string) || "",
      budget: (fd.get("budget") as string) || "",
      timeline: (fd.get("timeline") as string) || "",
      name: (fd.get("name") as string) || "",
      email: (fd.get("email") as string) || "",
      phone: (fd.get("phone") as string) || "",
      submittedAt: new Date().toISOString(),
    };

    const result = await submitProjectRequest(data);
    setSubmitting(false);

    if (result.success) {
      setResultId(result.id ?? "ok");
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  // ── Success state ───────────────────────────────────────────────

  if (resultId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Request Submitted
        </h1>
        <p className="mx-auto mt-4 max-w-md text-gray-700/70">
          We&apos;ve received your project request and will connect you with
          qualified local contractors. Expect to hear back shortly.
        </p>
        <p className="mt-2 text-xs text-gray-700/40">
          Reference: {resultId}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-800";
  const selectClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Project details ── */}
      <fieldset>
        <legend className="text-lg font-bold text-gray-900">
          Project Details
        </legend>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Trade */}
          <div>
            <label htmlFor="rf-trade" className={labelClass}>
              Trade <span className="text-gray-400">*</span>
            </label>
            <select
              id="rf-trade"
              name="trade"
              required
              defaultValue={prefill?.trade ?? ""}
              className={selectClass}
            >
              <option value="" disabled>
                Select a trade
              </option>
              {trades.map((t) => (
                <option key={t.slug} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label htmlFor="rf-city" className={labelClass}>
              City <span className="text-gray-400">*</span>
            </label>
            <select
              id="rf-city"
              name="city"
              required
              defaultValue={prefill?.city ?? ""}
              className={selectClass}
            >
              <option value="" disabled>
                Select a city
              </option>
              {cities.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project type */}
        <div className="mt-4">
          <label htmlFor="rf-projectType" className={labelClass}>
            Project Type <span className="text-gray-400">*</span>
          </label>
          <input
            id="rf-projectType"
            name="projectType"
            type="text"
            required
            defaultValue={prefill?.projectType ?? ""}
            placeholder="e.g. Panel Upgrade, Roof Replacement"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div className="mt-4">
          <label htmlFor="rf-description" className={labelClass}>
            Describe Your Project
          </label>
          <textarea
            id="rf-description"
            name="description"
            rows={3}
            placeholder="Tell us about the project — what needs to be done, any special requirements, etc."
            className={inputClass + " resize-y"}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Budget */}
          <div>
            <label htmlFor="rf-budget" className={labelClass}>
              Budget Range
            </label>
            <select
              id="rf-budget"
              name="budget"
              defaultValue=""
              className={selectClass}
            >
              <option value="">Not sure yet</option>
              {budgetRanges.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label htmlFor="rf-timeline" className={labelClass}>
              Timeline <span className="text-gray-400">*</span>
            </label>
            <select
              id="rf-timeline"
              name="timeline"
              required
              defaultValue={prefill?.timeline ?? ""}
              className={selectClass}
            >
              <option value="" disabled>
                When do you need this?
              </option>
              {timelineOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Photo upload placeholder */}
        <div className="mt-4">
          <label className={labelClass}>Photos (coming soon)</label>
          <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-4 py-6 text-center">
            <p className="text-sm text-gray-400">
              Photo upload will be available in a future update
            </p>
          </div>
        </div>
      </fieldset>

      {/* ── Contact info ── */}
      <fieldset>
        <legend className="text-lg font-bold text-gray-900">
          Your Contact Info
        </legend>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="rf-name" className={labelClass}>
              Name <span className="text-gray-400">*</span>
            </label>
            <input
              id="rf-name"
              name="name"
              type="text"
              required
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="rf-email" className={labelClass}>
              Email <span className="text-gray-400">*</span>
            </label>
            <input
              id="rf-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="rf-phone" className={labelClass}>
              Phone <span className="text-gray-400">*</span>
            </label>
            <input
              id="rf-phone"
              name="phone"
              type="tel"
              required
              placeholder="(530) 555-0000"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Error ── */}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {/* ── Submit ── */}
      <div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Submitting…" : "Submit Project Request"}
        </button>
        <p className="mt-2 text-xs text-gray-700/50">
          Free, no obligation. Your info is shared only with matched
          contractors.
        </p>
      </div>
    </form>
  );
}
