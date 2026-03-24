import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GoldCountry.guide — Find Trusted Local Contractors",
    template: "%s | GoldCountry.guide",
  },
  description:
    "Find trusted local contractors in Auburn, Grass Valley, Nevada City, and the Sierra foothills. Get quotes for electricians, plumbers, roofers, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="gold-ripple min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
