"use client";

import { useState } from "react";

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
  const [submitted, setSubmitted] = useState(false);

  if (projectTypes.length === 0) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // v1: no backend — show confirmation. Form data is structured
    // and ready to POST to an API endpoint when one exists.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-lg font-bold text-gray-900">Request Received</p>
        <p className="mt-2 text-sm text-gray-700/70">
          We&apos;ll connect you with{" "}
          {city
            ? `${tradePlural.toLowerCase()} in ${city}`
            : tradePlural.toLowerCase()}{" "}
          for your {projectType?.toLowerCase()} project. Expect a call shortly.
        </p>
      </div>
    );
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

      {/* Step 3: Contact form (revealed after timeline selected) */}
      {projectType && timeline && (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="qs-name"
                className="block text-sm font-medium text-gray-800"
              >
                Name
              </label>
              <input
                id="qs-name"
                name="name"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="qs-phone"
                className="block text-sm font-medium text-gray-800"
              >
                Phone
              </label>
              <input
                id="qs-phone"
                name="phone"
                type="tel"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none"
                placeholder="(530) 555-0000"
              />
            </div>
          </div>

          {/* Hidden prefilled fields */}
          <input type="hidden" name="trade" value={trade} />
          {city && <input type="hidden" name="city" value={city} />}
          <input type="hidden" name="projectType" value={projectType} />
          <input type="hidden" name="timeline" value={timeline} />

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 sm:w-auto"
          >
            Get Free Quotes
          </button>
          <p className="mt-2 text-xs text-gray-700/50">
            Free, no obligation. We&apos;ll match you with local{" "}
            {tradePlural.toLowerCase()}.
          </p>
        </form>
      )}
    </div>
  );
}
