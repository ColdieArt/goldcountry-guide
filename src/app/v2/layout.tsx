export const metadata = {
  title: "GoldCountry.guide - Vetted Local Contractors in the Sierra Foothills",
  description:
    "Hand-picked contractors vetted by local tradespeople. Electricians, plumbers, roofers, HVAC, and more serving Auburn, Grass Valley, Nevada City, and the Gold Country foothills.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  // Wraps children in a class that hides the root layout's Header/Footer
  return <div className="v2-page">{children}</div>;
}
