import { trades } from "@/data/trades";
import { cities } from "@/data/cities";
import RequestForm from "@/components/RequestForm";

export const metadata = {
  title: "Get Free Quotes from Trusted Local Contractors",
  description:
    "Tell us about your project and we'll connect you with 2-3 qualified local contractors in Gold Country — free, no obligation.",
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const prefill = {
    projectType: typeof sp.projectType === "string" ? sp.projectType : undefined,
    trade: typeof sp.trade === "string" ? sp.trade : undefined,
    city: typeof sp.city === "string" ? sp.city : undefined,
    timeline: typeof sp.timeline === "string" ? sp.timeline : undefined,
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
            Free &amp; No Obligation
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Find Your Perfect Contractor
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-neutral-400 leading-relaxed">
            Tell us about your project and we&apos;ll connect you with 2–3
            trusted, licensed pros in Gold Country.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8">
          <RequestForm
            trades={trades.map((t) => ({ slug: t.slug, name: t.name }))}
            cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
            prefill={prefill}
          />
        </div>
      </div>
    </div>
  );
}
