import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: {
    default: "LocalMarket NG — Buy & Sell Across Nigeria",
    template: "%s | LocalMarket NG",
  },
  description:
    "Nigeria's trusted local marketplace. Buy and sell phones, cars, fashion, property, jobs and more. Safe payments with 5% platform fee.",
  keywords: [
    "Nigeria marketplace",
    "buy and sell Nigeria",
    "Jiji alternative",
    "OLX Nigeria",
    "Nigerian classifieds",
    "local market Nigeria",
  ],
  authors: [{ name: "LocalMarket NG" }],
  openGraph: {
    title: "LocalMarket NG — Buy & Sell Across Nigeria",
    description: "Nigeria's trusted local marketplace with safe escrow payments.",
    type: "website",
    locale: "en_NG",
    countryName: "Nigeria",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <TooltipProvider>
          <I18nProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </I18nProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "rounded-xl border-gray-200 shadow-lg",
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
