export const metadata = {
  title: "GoldCountry.guide - Vetted Local Contractors in the Sierra Foothills",
  description:
    "Hand-picked contractors vetted by local tradespeople. Electricians, plumbers, roofers, HVAC, and more serving Auburn, Grass Valley, Nevada City, and the Gold Country foothills.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className="homepage-standalone">{children}</div>;
}
