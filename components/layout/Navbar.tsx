"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Plus,
  MessageSquare,
  User as UserIcon,
  Menu,
  X,
  Shield,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/listings", label: t("nav.browse", "Browse") },
    { href: "/categories", label: t("common.category", "Categories") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white font-bold text-lg">
            L
          </div>
          <span className="hidden text-lg font-bold text-gray-900 sm:block">
            LocalMarket<span className="text-brand-600">NG</span>
          </span>
        </Link>

        {/* Search bar (desktop) */}
        <div className="hidden flex-1 md:block">
          <form action="/listings" method="GET" className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              name="q"
              placeholder={t("common.search", "Search listings...")}
              className="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </form>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100",
                pathname.startsWith(link.href) && "text-brand-700"
              )}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex">
                <Link href="/listings/create">
                  <Plus className="h-4 w-4" />
                  {t("nav.sell", "Sell")}
                </Link>
              </Button>

              <Link
                href="/chat"
                className="relative rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                aria-label="Messages"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                  aria-label="Admin"
                >
                  <Shield className="h-5 w-5" />
                </Link>
              )}

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 rounded-full p-0.5 hover:bg-gray-100"
                >
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.full_name || user.email}
                    fallback={profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                    size="sm"
                  />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-xl animate-fade-in">
                      <div className="border-b border-gray-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {profile?.full_name || user.email}
                        </p>
                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href={`/profile/${user.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4" /> {t("nav.profile", "Profile")}
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4" /> Settings
                      </Link>
                      <Link
                        href="/wallet"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Wallet className="h-4 w-4" /> Wallet
                      </Link>
                      <button
                        onClick={signOut}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" /> {t("nav.logout", "Logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <LanguageSwitcher className="hidden sm:block" />
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t("nav.login", "Login")}</Link>
              </Button>
              <Button asChild variant="brand" size="sm">
                <Link href="/register">{t("nav.sell", "Sign Up")}</Link>
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            <form action="/listings" method="GET" className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                name="q"
                placeholder={t("common.search", "Search...")}
                className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none"
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/listings/create"
                className="block rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.sell", "Sell")}
              </Link>
            )}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
