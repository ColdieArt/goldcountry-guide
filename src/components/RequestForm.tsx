"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  submitProjectRequest,
  type ProjectRequest,
} from "@/lib/submissions";

// ─── Props ──────────────────────────────────────────────────────

interface RequestFormProps {
  trades: { slug: string; name: string }[];
  cities: { slug: string; name: string }[];
  prefill?: {
    projectType?: string;
    trade?: string;
    city?: string;
    timeline?: string;
  };
}

// ─── Form State ─────────────────────────────────────────────────

interface FormState {
  // Step 1: Service
  serviceCategory: string;
  notSureText: string;
  // Step 2: Project details (dynamic)
  serviceSubcategory: string;
  isEmergency: string;
  projectLocation: string;
  projectDuration: string;
  homeAge: string;
  roofAge: string;
  insuranceClaim: string;
  yardArea: string;
  systemType: string;
  projectDescription: string;
  // Step 3: Scope
  timeline: string;
  budget: string;
  // Step 4: Property
  city: string;
  propertyType: string;
  ownership: string;
  propertyAge: string;
  // Step 5: Contact
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredContact: string;
  bestTime: string;
  // Step 6: Additional
  additionalNotes: string;
}

const INITIAL_STATE: FormState = {
  serviceCategory: "",
  notSureText: "",
  serviceSubcategory: "",
  isEmergency: "",
  projectLocation: "",
  projectDuration: "",
  homeAge: "",
  roofAge: "",
  insuranceClaim: "",
  yardArea: "",
  systemType: "",
  projectDescription: "",
  timeline: "",
  budget: "",
  city: "",
  propertyType: "",
  ownership: "",
  propertyAge: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  preferredContact: "",
  bestTime: "",
  additionalNotes: "",
};

// ─── Service Categories ─────────────────────────────────────────

const SERVICE_CATEGORIES = [
  { value: "general-contractors", label: "Home Improvement", icon: "🏠" },
  { value: "plumbers", label: "Plumbing", icon: "🔧" },
  { value: "electricians", label: "Electrical", icon: "⚡" },
  { value: "roofers", label: "Roofing", icon: "🏗️" },
  { value: "tree-service", label: "Landscaping & Trees", icon: "🌳" },
  { value: "hvac", label: "HVAC / Heating & Cooling", icon: "❄️" },
  { value: "concrete-contractors", label: "Concrete & Flatwork", icon: "🧱" },
  { value: "architects", label: "Design & Architecture", icon: "📐" },
  { value: "not-sure", label: "Not sure yet", icon: "💬" },
];

// ─── Dynamic Subcategories ──────────────────────────────────────

const SUBCATEGORIES: Record<string, { value: string; label: string }[]> = {
  "general-contractors": [
    { value: "kitchen-remodel", label: "Kitchen remodel" },
    { value: "bathroom-remodel", label: "Bathroom remodel" },
    { value: "addition", label: "Addition" },
    { value: "whole-house", label: "Whole house remodel" },
    { value: "adu", label: "ADU / Guest house" },
    { value: "other", label: "Other" },
  ],
  plumbers: [
    { value: "leak", label: "Leak or drip" },
    { value: "clogged-drain", label: "Clogged drain" },
    { value: "water-heater", label: "Water heater" },
    { value: "new-installation", label: "New installation" },
    { value: "remodel-plumbing", label: "Remodel plumbing" },
    { value: "sewer-septic", label: "Sewer / Septic" },
    { value: "other", label: "Other" },
  ],
  electricians: [
    { value: "repair", label: "Repair / Troubleshooting" },
    { value: "panel-upgrade", label: "Panel upgrade" },
    { value: "outlets-switches", label: "New outlets / switches" },
    { value: "lighting", label: "Lighting" },
    { value: "ev-charger", label: "EV charger install" },
    { value: "rewire", label: "Whole house rewire" },
    { value: "other", label: "Other" },
  ],
  roofers: [
    { value: "leak", label: "Roof leak" },
    { value: "missing-shingles", label: "Missing shingles / damage" },
    { value: "storm-damage", label: "Storm damage" },
    { value: "full-replacement", label: "Full replacement" },
    { value: "gutter-work", label: "Gutter work" },
    { value: "other", label: "Other" },
  ],
  hvac: [
    { value: "ac-not-cooling", label: "AC not cooling" },
    { value: "heater-not-working", label: "Heater not working" },
    { value: "strange-noises", label: "Strange noises" },
    { value: "maintenance", label: "Maintenance / Tune-up" },
    { value: "new-system", label: "New system" },
    { value: "ductwork", label: "Ductwork" },
    { value: "other", label: "Other" },
  ],
  "tree-service": [
    { value: "removal", label: "Tree removal" },
    { value: "trimming", label: "Trimming / Pruning" },
    { value: "stump-grinding", label: "Stump grinding" },
    { value: "fire-clearing", label: "Fire clearing / Defensible space" },
    { value: "cleanup", label: "Storm cleanup" },
    { value: "other", label: "Other" },
  ],
  "concrete-contractors": [
    { value: "driveway", label: "Driveway" },
    { value: "patio", label: "Patio / Walkway" },
    { value: "foundation", label: "Foundation" },
    { value: "retaining-wall", label: "Retaining wall" },
    { value: "decorative", label: "Decorative / Stamped" },
    { value: "other", label: "Other" },
  ],
  architects: [
    { value: "custom-home", label: "Custom home design" },
    { value: "adu-plans", label: "ADU plans" },
    { value: "remodel-plans", label: "Remodel blueprints" },
    { value: "permitting", label: "Permitting help" },
    { value: "other", label: "Other" },
  ],
};

const TIMELINE_OPTIONS = [
  { value: "emergency", label: "ASAP / Emergency" },
  { value: "1-2-weeks", label: "Within 1–2 weeks" },
  { value: "this-month", label: "Within a month" },
  { value: "1-3-months", label: "1–3 months out" },
  { value: "planning", label: "Just researching for now" },
];

const BUDGET_OPTIONS = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-30k", label: "$15,000 – $30,000" },
  { value: "30k-75k", label: "$30,000 – $75,000" },
  { value: "75k-plus", label: "$75,000+" },
  { value: "unsure", label: "Not sure yet (that's okay!)" },
];

const CITY_OPTIONS = [
  { value: "auburn", label: "Auburn" },
  { value: "grass-valley", label: "Grass Valley" },
  { value: "nevada-city", label: "Nevada City" },
  { value: "newcastle", label: "Newcastle" },
  { value: "rocklin", label: "Rocklin" },
  { value: "loomis", label: "Loomis" },
  { value: "roseville", label: "Roseville" },
];

const PROPERTY_TYPES = [
  { value: "single-family", label: "Single family home" },
  { value: "townhouse-condo", label: "Townhouse / Condo" },
  { value: "multi-family", label: "Multi-family" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

const OWNERSHIP_OPTIONS = [
  { value: "owner", label: "I own the property" },
  { value: "renter", label: "Renter (with landlord approval)" },
  { value: "property-manager", label: "Property manager" },
];

const PROPERTY_AGE_OPTIONS = [
  { value: "new", label: "New construction (0–10 years)" },
  { value: "10-30", label: "10–30 years" },
  { value: "30-50", label: "30–50 years" },
  { value: "50-plus", label: "50+ years" },
  { value: "historic", label: "Historic / Vintage" },
  { value: "not-sure", label: "Not sure" },
];

const CONTACT_METHODS = [
  { value: "phone", label: "Phone call" },
  { value: "text", label: "Text message" },
  { value: "email", label: "Email" },
  { value: "any", label: "Any works" },
];

const BEST_TIMES = [
  { value: "morning", label: "Morning (8am–12pm)" },
  { value: "afternoon", label: "Afternoon (12pm–5pm)" },
  { value: "evening", label: "Evening (5pm–8pm)" },
  { value: "anytime", label: "Anytime" },
];

const TOTAL_STEPS = 7;
const STORAGE_KEY = "gcg-lead-form";

// ─── Component ──────────────────────────────────────────────────

export default function RequestForm({
  prefill,
}: RequestFormProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(() => {
    const initial = { ...INITIAL_STATE };
    if (prefill?.trade) initial.serviceCategory = prefill.trade;
    if (prefill?.city) initial.city = prefill.city;
    if (prefill?.timeline) initial.timeline = prefill.timeline;
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed.form }));
        if (parsed.step) setStep(parsed.step);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
    } catch {
      // ignore
    }
  }, [form, step, hydrated]);

  const update = useCallback(
    (field: keyof FormState, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const selectAndAdvance = useCallback(
    (field: keyof FormState, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), 200);
    },
    []
  );

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), []);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);

    const data: ProjectRequest = {
      projectType: form.serviceSubcategory || form.serviceCategory,
      trade: form.serviceCategory === "not-sure" ? "" : form.serviceCategory,
      city: form.city,
      description: [form.projectDescription, form.additionalNotes].filter(Boolean).join("\n\n"),
      budget: form.budget,
      timeline: form.timeline,
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      submittedAt: new Date().toISOString(),
    };

    const result = await submitProjectRequest(data);
    setSubmitting(false);

    if (result.success) {
      setResultId(result.id ?? "ok");
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  // ── Styles ──────────────────────────────────────────────────────

  const cardBtn = (selected: boolean) =>
    `w-full rounded-xl border-2 px-4 py-3 text-left transition-all ${
      selected
        ? "border-amber-500 bg-amber-50 shadow-sm"
        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
    }`;

  const pillBtn = (selected: boolean) =>
    `rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
      selected
        ? "border-amber-500 bg-amber-50 text-gray-900"
        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
    }`;

  const inputClass =
    "w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none transition-colors";

  const primaryBtn =
    "rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50";

  const secondaryBtn =
    "rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50";

  // ── Success ─────────────────────────────────────────────────────

  if (resultId) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          You&apos;re all set, {form.firstName || "friend"}!
        </h2>
        <p className="mt-3 text-gray-700/70">
          Here&apos;s what happens next:
        </p>
        <div className="mx-auto mt-6 max-w-sm space-y-3 text-left">
          <div className="flex gap-3 rounded-lg bg-gray-50 p-3">
            <span className="text-lg">✓</span>
            <span className="text-sm text-gray-700">We&apos;re reviewing your request now</span>
          </div>
          <div className="flex gap-3 rounded-lg bg-gray-50 p-3">
            <span className="text-lg">✓</span>
            <span className="text-sm text-gray-700">
              2–3 qualified{" "}
              {SERVICE_CATEGORIES.find((c) => c.value === form.serviceCategory)?.label?.toLowerCase() || "service"}{" "}
              contractors in{" "}
              {CITY_OPTIONS.find((c) => c.value === form.city)?.label || "your area"}{" "}
              will reach out within 24 hours
            </span>
          </div>
          <div className="flex gap-3 rounded-lg bg-gray-50 p-3">
            <span className="text-lg">✓</span>
            <span className="text-sm text-gray-700">Compare quotes, ask questions, and choose the best fit</span>
          </div>
          <div className="flex gap-3 rounded-lg bg-gray-50 p-3">
            <span className="text-lg">✓</span>
            <span className="text-sm text-gray-700">No obligation — this service is completely free for homeowners</span>
          </div>
        </div>
        {form.email && (
          <p className="mt-4 text-sm text-gray-500">
            Confirmation sent to {form.email}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-400">Ref: {resultId}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // ── Progress ────────────────────────────────────────────────────

  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  // ── Step validation ─────────────────────────────────────────────

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return form.serviceCategory !== "" && (form.serviceCategory !== "not-sure" || form.notSureText.trim().length > 0);
      case 2:
        return form.serviceCategory === "not-sure" || form.serviceSubcategory !== "";
      case 3:
        return form.timeline !== "" && form.budget !== "";
      case 4:
        return form.city !== "" && form.propertyType !== "" && form.ownership !== "";
      case 5:
        return (
          form.firstName.trim() !== "" &&
          form.lastName.trim() !== "" &&
          form.phone.replace(/\D/g, "").length >= 10 &&
          form.email.includes("@")
        );
      case 6:
        return true; // optional step
      default:
        return true;
    }
  };

  // ── Render ──────────────────────────────────────────────────────

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>Step {step} of {TOTAL_STEPS}</span>
        {step > 1 && step < TOTAL_STEPS && (
          <span className="font-medium text-amber-600">Almost there!</span>
        )}
      </div>
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Steps */}
      <div className="min-h-[400px]">
        {step === 1 && (
          <StepWrapper>
            <StepHeader
              title="What can we help you with today?"
              subtitle="Select the type of service you need and we'll connect you with trusted local pros."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={cardBtn(form.serviceCategory === cat.value)}
                  onClick={() => {
                    update("serviceCategory", cat.value);
                    if (cat.value !== "not-sure") {
                      setTimeout(() => next(), 200);
                    }
                  }}
                >
                  <span className="mr-2 text-lg">{cat.icon}</span>
                  <span className="font-medium text-gray-900">{cat.label}</span>
                </button>
              ))}
            </div>
            {form.serviceCategory === "not-sure" && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  No problem! Tell us a bit about what&apos;s going on and we&apos;ll point you in the right direction.
                </p>
                <textarea
                  value={form.notSureText}
                  onChange={(e) => update("notSureText", e.target.value)}
                  placeholder="Describe what you need help with..."
                  rows={3}
                  className={inputClass + " mt-2 resize-y"}
                />
              </div>
            )}
          </StepWrapper>
        )}

        {step === 2 && (
          <StepWrapper>
            {form.serviceCategory === "not-sure" ? (
              <>
                <StepHeader
                  title="Tell us more about your project"
                  subtitle="Any extra details help us find the right contractor for you."
                />
                <textarea
                  value={form.projectDescription}
                  onChange={(e) => update("projectDescription", e.target.value)}
                  placeholder="Describe the work you need done, any issues you're seeing, etc."
                  rows={4}
                  className={inputClass + " mt-6 resize-y"}
                />
              </>
            ) : (
              <>
                <StepHeader
                  title={`Got it — ${SERVICE_CATEGORIES.find((c) => c.value === form.serviceCategory)?.label?.toLowerCase()} help!`}
                  subtitle="What specifically do you need?"
                />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(SUBCATEGORIES[form.serviceCategory] || []).map((sub) => (
                    <button
                      key={sub.value}
                      type="button"
                      className={cardBtn(form.serviceSubcategory === sub.value)}
                      onClick={() => selectAndAdvance("serviceSubcategory", sub.value)}
                    >
                      <span className="font-medium text-gray-900">{sub.label}</span>
                    </button>
                  ))}
                </div>

                {/* Dynamic follow-up for specific trades */}
                {form.serviceCategory === "plumbers" && form.serviceSubcategory && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Is this an emergency?</p>
                      <div className="mt-2 flex gap-2">
                        {[{ value: "yes", label: "Yes — need help today" }, { value: "no", label: "No — can schedule" }].map((o) => (
                          <button key={o.value} type="button" className={pillBtn(form.isEmergency === o.value)} onClick={() => update("isEmergency", o.value)}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {form.serviceCategory === "electricians" && form.serviceSubcategory && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-800">Approximate age of your home&apos;s wiring?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {PROPERTY_AGE_OPTIONS.map((o) => (
                        <button key={o.value} type="button" className={pillBtn(form.homeAge === o.value)} onClick={() => update("homeAge", o.value)}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {form.serviceCategory === "roofers" && form.serviceSubcategory && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Insurance claim involved?</p>
                      <div className="mt-2 flex gap-2">
                        {[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "not-sure", label: "Not sure" }].map((o) => (
                          <button key={o.value} type="button" className={pillBtn(form.insuranceClaim === o.value)} onClick={() => update("insuranceClaim", o.value)}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {form.serviceCategory === "hvac" && form.serviceSubcategory && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-800">System type (if known)?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        { value: "central-air", label: "Central air" },
                        { value: "heat-pump", label: "Heat pump" },
                        { value: "furnace", label: "Furnace" },
                        { value: "mini-split", label: "Mini-split" },
                        { value: "not-sure", label: "Not sure" },
                      ].map((o) => (
                        <button key={o.value} type="button" className={pillBtn(form.systemType === o.value)} onClick={() => update("systemType", o.value)}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </StepWrapper>
        )}

        {step === 3 && (
          <StepWrapper>
            <StepHeader
              title="When and how much?"
              subtitle="This helps us match you with the right pros. No pressure if you're still figuring things out!"
            />
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-800">When are you hoping to get started?</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {TIMELINE_OPTIONS.map((t) => (
                    <button key={t.value} type="button" className={cardBtn(form.timeline === t.value)} onClick={() => update("timeline", t.value)}>
                      <span className="font-medium text-gray-900">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  What are you comfortable investing in this project?
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {BUDGET_OPTIONS.map((b) => (
                    <button key={b.value} type="button" className={cardBtn(form.budget === b.value)} onClick={() => update("budget", b.value)}>
                      <span className="font-medium text-gray-900">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </StepWrapper>
        )}

        {step === 4 && (
          <StepWrapper>
            <StepHeader
              title="Where's the project?"
              subtitle="Help us find contractors who serve your area."
            />
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-800">City</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {CITY_OPTIONS.map((c) => (
                    <button key={c.value} type="button" className={cardBtn(form.city === c.value)} onClick={() => update("city", c.value)}>
                      <span className="font-medium text-gray-900">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Property type</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((p) => (
                    <button key={p.value} type="button" className={pillBtn(form.propertyType === p.value)} onClick={() => update("propertyType", p.value)}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Do you own or rent?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {OWNERSHIP_OPTIONS.map((o) => (
                    <button key={o.value} type="button" className={pillBtn(form.ownership === o.value)} onClick={() => update("ownership", o.value)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Age of home (approximate)</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PROPERTY_AGE_OPTIONS.map((a) => (
                    <button key={a.value} type="button" className={pillBtn(form.propertyAge === a.value)} onClick={() => update("propertyAge", a.value)}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </StepWrapper>
        )}

        {step === 5 && (
          <StepWrapper>
            <StepHeader
              title="Almost done! Let's get your contact info"
              subtitle="So our trusted local pros can reach out with quotes."
            />
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lf-first" className="block text-sm font-medium text-gray-800">
                    First name
                  </label>
                  <input
                    id="lf-first"
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="First name"
                    className={inputClass + " mt-1"}
                  />
                </div>
                <div>
                  <label htmlFor="lf-last" className="block text-sm font-medium text-gray-800">
                    Last name
                  </label>
                  <input
                    id="lf-last"
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Last name"
                    className={inputClass + " mt-1"}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lf-phone" className="block text-sm font-medium text-gray-800">
                  What&apos;s the best number to reach you?
                </label>
                <input
                  id="lf-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(530) 555-0000"
                  className={inputClass + " mt-1"}
                />
              </div>
              <div>
                <label htmlFor="lf-email" className="block text-sm font-medium text-gray-800">
                  Email (for your confirmation)
                </label>
                <input
                  id="lf-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass + " mt-1"}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Preferred contact method</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONTACT_METHODS.map((m) => (
                    <button key={m.value} type="button" className={pillBtn(form.preferredContact === m.value)} onClick={() => update("preferredContact", m.value)}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Best time to contact</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BEST_TIMES.map((t) => (
                    <button key={t.value} type="button" className={pillBtn(form.bestTime === t.value)} onClick={() => update("bestTime", t.value)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </StepWrapper>
        )}

        {step === 6 && (
          <StepWrapper>
            <StepHeader
              title="Anything else?"
              subtitle="Optional — but extra details help contractors give more accurate quotes."
            />
            <div className="mt-6">
              <textarea
                value={form.additionalNotes}
                onChange={(e) => update("additionalNotes", e.target.value)}
                placeholder="Any details, photos you'd like to mention, special requirements..."
                rows={4}
                className={inputClass + " resize-y"}
              />
              <p className="mt-3 text-xs text-gray-500">
                Photo upload coming soon — for now, describe what you see or mention you&apos;ll share photos later.
              </p>
            </div>
          </StepWrapper>
        )}

        {step === 7 && (
          <StepWrapper>
            <StepHeader
              title="Let's make sure everything looks right"
              subtitle="Review your info before we send it to local contractors."
            />
            <div className="mt-6 space-y-3">
              <SummaryRow
                icon="🔧"
                label="Service"
                value={
                  form.serviceCategory === "not-sure"
                    ? "Not sure yet"
                    : `${SERVICE_CATEGORIES.find((c) => c.value === form.serviceCategory)?.label || form.serviceCategory}${form.serviceSubcategory ? ` — ${SUBCATEGORIES[form.serviceCategory]?.find((s) => s.value === form.serviceSubcategory)?.label || form.serviceSubcategory}` : ""}`
                }
              />
              <SummaryRow
                icon="📅"
                label="Timeline"
                value={TIMELINE_OPTIONS.find((t) => t.value === form.timeline)?.label || form.timeline}
              />
              <SummaryRow
                icon="💰"
                label="Budget"
                value={BUDGET_OPTIONS.find((b) => b.value === form.budget)?.label || form.budget}
              />
              <SummaryRow
                icon="📍"
                label="Location"
                value={`${CITY_OPTIONS.find((c) => c.value === form.city)?.label || form.city} — ${PROPERTY_TYPES.find((p) => p.value === form.propertyType)?.label || form.propertyType}`}
              />
              <SummaryRow
                icon="👤"
                label="Contact"
                value={`${form.firstName} ${form.lastName} · ${form.phone} · ${form.email}`}
              />
              {form.additionalNotes && (
                <SummaryRow icon="📝" label="Notes" value={form.additionalNotes} />
              )}
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                Hmm, something went wrong. Mind trying again?
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button type="button" className={secondaryBtn} onClick={prev}>
                Edit
              </button>
              <button
                type="button"
                className={primaryBtn}
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Sending..." : "Looks good — send it!"}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Your information is never sold or shared. Free for homeowners — always.
              Only verified, licensed contractors.
            </p>
          </StepWrapper>
        )}
      </div>

      {/* Navigation */}
      {step < TOTAL_STEPS && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <div>
            {step > 1 && (
              <button type="button" className={secondaryBtn} onClick={prev}>
                Back
              </button>
            )}
          </div>
          <button
            type="button"
            className={primaryBtn}
            disabled={!canAdvance()}
            onClick={next}
          >
            {step === 6 ? "Review & Submit" : "Continue"}
          </button>
        </div>
      )}

      {/* Trust badges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔒 Your info is never sold</span>
        <span>·</span>
        <span>Free for homeowners</span>
        <span>·</span>
        <span>Licensed contractors only</span>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────

function StepWrapper({ children }: { children: React.ReactNode }) {
  return <div className="animate-fadeIn">{children}</div>;
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-lg bg-gray-50 p-3">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );
}
