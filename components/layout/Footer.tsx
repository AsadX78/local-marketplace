"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";

const footerSections = [
  {
    title: "Marketplace",
    links: [
      { href: "/listings", label: "All Listings" },
      { href: "/categories", label: "Categories" },
      { href: "/listings/create", label: "Post a Listing" },
      { href: "/listings?sort=nearest", label: "Near Me" },
    ],
  },
  {
    title: "Popular Categories",
    links: [
      { href: "/categories/electronics", label: "Electronics" },
      { href: "/categories/vehicles", label: "Vehicles" },
      { href: "/categories/fashion", label: "Fashion" },
      { href: "/categories/property", label: "Property" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/safety", label: "Safety Tips" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold">
                L
              </div>
              <span className="text-lg font-bold text-white">
                LocalMarket<span className="text-brand-400">NG</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Nigeria&apos;s trusted local marketplace. Buy and sell safely with escrow
              payments.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          {t("footer.copyright", "© 2026 LocalMarket NG. All rights reserved.")}
        </div>
      </div>
    </footer>
  );
}
