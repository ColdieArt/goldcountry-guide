"use client";

import dynamic from "next/dynamic";

const GoldCountryMap = dynamic(() => import("./GoldCountryMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500">
      Loading map&hellip;
    </div>
  ),
});

interface GoldCountryMapWrapperProps {
  focusCitySlug?: string;
}

export default function GoldCountryMapWrapper({ focusCitySlug }: GoldCountryMapWrapperProps) {
  return <GoldCountryMap focusCitySlug={focusCitySlug} />;
}
