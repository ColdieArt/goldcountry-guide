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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-amber-600">
          Free &amp; No Obligation
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Find Your Perfect Contractor
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-gray-600">
          Tell us about your project and we&apos;ll connect you with 2–3
          trusted, licensed pros in Gold Country.
        </p>
      </div>

      <RequestForm
        trades={trades.map((t) => ({ slug: t.slug, name: t.name }))}
        cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
        prefill={prefill}
      />
    </div>
  );
}
