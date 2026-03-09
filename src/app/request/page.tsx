import { trades } from "@/data/trades";
import { cities } from "@/data/cities";
import RequestForm from "@/components/RequestForm";

export const metadata = {
  title: "Request a Project Quote",
  description:
    "Tell us about your project and we'll connect you with trusted local contractors in Gold Country.",
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
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Request a Project Quote
      </h1>
      <p className="mt-3 text-gray-700/70">
        Tell us about your project and we&apos;ll match you with qualified
        local contractors in Gold Country.
      </p>

      <div className="mt-8">
        <RequestForm
          trades={trades.map((t) => ({ slug: t.slug, name: t.name }))}
          cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
          prefill={prefill}
        />
      </div>
    </div>
  );
}
