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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
