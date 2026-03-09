import { notFound } from "next/navigation";
import Link from "next/link";
import { getTradeBySlug, getAllTradeSlugs } from "@/data/trades";
import { getCityBySlug, getAllCitySlugs } from "@/data/cities";
import {
  getContractorBySlug,
  getContractorsByTrade,
  getContractorsByTradeAndCity,
} from "@/data/contractors";

export function generateStaticParams() {
  const params: { slug: string; subSlug: string }[] = [];

  for (const tradeSlug of getAllTradeSlugs()) {
    // Trade + city combos
    for (const citySlug of getAllCitySlugs()) {
      params.push({ slug: tradeSlug, subSlug: citySlug });
    }
    // Trade + contractor combos
    for (const c of getContractorsByTrade(tradeSlug)) {
      params.push({ slug: tradeSlug, subSlug: c.slug });
    }
  }

  return params;
}

export function generateMetadata({
  params,
}: {
  params: { slug: string; subSlug: string };
}) {
  const trade = getTradeBySlug(params.slug);
  if (!trade) return {};

  const city = getCityBySlug(params.subSlug);
  if (city) {
    return {
      title: `${trade.namePlural} in ${city.name}, CA`,
      description: `Find licensed ${trade.namePlural.toLowerCase()} in ${city.name}, ${city.county} County. Get quotes from trusted local professionals.`,
    };
  }

  const contractor = getContractorBySlug(params.subSlug);
  if (contractor && contractor.tradeSlug === trade.slug) {
    const cityNames = contractor.citySlugs
      .map((s) => getCityBySlug(s)?.name)
      .filter(Boolean)
      .join(", ");
    return {
      title: `${contractor.name} — ${trade.name} in ${cityNames}`,
      description: contractor.description,
    };
  }

  return {};
}

export default function SubSlugPage({
  params,
}: {
  params: { slug: string; subSlug: string };
}) {
  const trade = getTradeBySlug(params.slug);
  if (!trade) notFound();

  // Check if subSlug is a city
  const city = getCityBySlug(params.subSlug);
  if (city) return <TradeCityPage tradeSlug={trade.slug} citySlug={city.slug} />;

  // Check if subSlug is a contractor
  const contractor = getContractorBySlug(params.subSlug);
  if (contractor && contractor.tradeSlug === trade.slug) {
    return <ContractorProfilePage tradeSlug={trade.slug} contractorSlug={contractor.slug} />;
  }

  notFound();
}

function TradeCityPage({
  tradeSlug,
  citySlug,
}: {
  tradeSlug: string;
  citySlug: string;
}) {
  const trade = getTradeBySlug(tradeSlug)!;
  const city = getCityBySlug(citySlug)!;
  const contractors = getContractorsByTradeAndCity(trade.slug, city.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-sm text-amber-700/60">
        <Link href={`/${trade.slug}`} className="hover:text-amber-700">
          {trade.namePlural}
        </Link>
        {" / "}
        <Link href={`/${city.slug}`} className="hover:text-amber-700">
          {city.name}
        </Link>
      </div>

      <h1 className="mt-2 text-3xl font-bold text-amber-900">
        {trade.namePlural} in {city.name}, CA
      </h1>
      <p className="mt-3 max-w-2xl text-amber-700/70">
        Browse licensed {trade.namePlural.toLowerCase()} serving {city.name} and{" "}
        {city.county} County.
      </p>

      {contractors.length > 0 ? (
        <div className="mt-8 space-y-4">
          {contractors.map((c) => (
            <Link
              key={c.slug}
              href={`/${trade.slug}/${c.slug}`}
              className="block rounded-lg border border-amber-200 p-5 transition-colors hover:border-amber-400 hover:bg-amber-50"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-amber-900">
                  {c.name}
                </h2>
                {c.licensed && (
                  <span className="text-xs font-medium text-green-700">
                    Licensed
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-amber-700/70">{c.description}</p>
              <p className="mt-2 text-sm text-amber-700/60">
                {c.yearsInBusiness} years in business &middot; {c.phone}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-amber-800">
            No {trade.namePlural.toLowerCase()} listed in {city.name} yet.
          </p>
          <p className="mt-1 text-sm text-amber-700/60">
            Are you a {trade.name.toLowerCase()} in {city.name}?{" "}
            <span className="font-medium text-amber-700">
              Contact us to get listed.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

function ContractorProfilePage({
  tradeSlug,
  contractorSlug,
}: {
  tradeSlug: string;
  contractorSlug: string;
}) {
  const trade = getTradeBySlug(tradeSlug)!;
  const contractor = getContractorBySlug(contractorSlug)!;
  const cityNames = contractor.citySlugs
    .map((s) => getCityBySlug(s))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-sm text-amber-700/60">
        <Link href={`/${trade.slug}`} className="hover:text-amber-700">
          {trade.namePlural}
        </Link>
        {" / "}
        {contractor.name}
      </div>

      <h1 className="mt-2 text-3xl font-bold text-amber-900">
        {contractor.name}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {contractor.licensed && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            Licensed{" "}
            {contractor.licenseNumber && `(${contractor.licenseNumber})`}
          </span>
        )}
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          {contractor.yearsInBusiness} years in business
        </span>
      </div>

      <p className="mt-6 leading-relaxed text-amber-800/80">
        {contractor.description}
      </p>

      <div className="mt-8 rounded-lg border border-amber-200 p-6">
        <h2 className="font-semibold text-amber-900">Contact Information</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-amber-800">Phone:</dt>
            <dd className="text-amber-700/70">{contractor.phone}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-amber-800">Service Areas:</dt>
            <dd className="text-amber-700/70">
              {cityNames.map((city, i) => (
                <span key={city!.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={`/${trade.slug}/${city!.slug}`}
                    className="underline hover:text-amber-700"
                  >
                    {city!.name}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-amber-800">Trade:</dt>
            <dd className="text-amber-700/70">
              <Link
                href={`/${trade.slug}`}
                className="underline hover:text-amber-700"
              >
                {trade.name}
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
