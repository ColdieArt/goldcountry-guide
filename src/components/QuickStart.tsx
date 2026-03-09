"use client";

import { useState } from "react";
import Link from "next/link";

interface QuickStartProps {
  trade: string;          // e.g. "Electrician"
  tradePlural: string;    // e.g. "Electricians"
  city?: string;          // e.g. "Auburn" — omitted on cost guide pages
  projectTypes: string[]; // specialties + cost guide titles
}

const timelines = [
  { label: "Emergency", value: "emergency" },
  { label: "This week", value: "this-week" },
  { label: "This month", value: "this-month" },
  { label: "Just planning", value: "planning" },
];

export default function QuickStart({
  trade,
  tradePlural,
  city,
  projectTypes,
}: QuickStartProps) {
  const [projectType, setProjectType] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);

  if (projectTypes.length === 0) return null;

  // Build prefilled URL for the full request form
  function getRequestUrl() {
    const params = new URLSearchParams();
    params.set("trade", trade);
    if (city) params.set("city", city);
    if (projectType) params.set("projectType", projectType);
    if (timeline) params.set("timeline", timeline);
    return `/request?${params.toString()}`;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-bold text-gray-900">
        What do you need help with?
      </h3>

      {/* Step 1: Project type */}
      <div className="mt-3 flex flex-wrap gap-2">
        {projectTypes.map((pt) => (
          <button
            key={pt}
            type="button"
            onClick={() => setProjectType(pt)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              projectType === pt
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 text-gray-800 hover:bg-gray-50"
            }`}
          >
            {pt}
          </button>
        ))}
      </div>

      {/* Step 2: Timeline (revealed after project type selected) */}
      {projectType && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900">When do you need this?</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {timelines.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTimeline(t.value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  timeline === t.value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Link to full request form with prefills */}
      {projectType && timeline && (
        <div className="mt-6">
          <Link
            href={getRequestUrl()}
            className="inline-block w-full rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-800 sm:w-auto"
          >
            Get Free Quotes
          </Link>
          <p className="mt-2 text-xs text-gray-700/50">
            Free, no obligation. We&apos;ll match you with local{" "}
            {tradePlural.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  );
}
