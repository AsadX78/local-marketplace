"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MessageSquare,
  User as UserIcon,
  Menu,
  X,
  Shield,
  Wallet,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navLinks = [
    { href: "/listings", label: t("nav.browse", "Browse") },
    { href: "/categories", label: t("common.category", "Categories") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold text-lg shadow-lg shadow-brand-500/25"
          >
            L
          </motion.div>
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
              className="h-10 w-full rounded-full border border-gray-200 bg-gray-50/80 pl-10 pr-4 text-sm transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
                "rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith(link.href) && "bg-brand-50 text-brand-700"
              )}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex shadow-md shadow-brand-500/20">
                <Link href="/listings/create">
                  <Plus className="h-4 w-4" />
                  {t("nav.sell", "Sell")}
                </Link>
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/chat"
                    className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Messages</TooltipContent>
              </Tooltip>

              {isAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/admin"
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Shield className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Admin</TooltipContent>
                </Tooltip>
              )}

              {/* User menu — Radix DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-full p-0.5 transition-colors hover:bg-gray-100">
                    <Avatar
                      src={profile?.avatar_url}
                      alt={profile?.full_name || user.email}
                      fallback={profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                      size="sm"
                    />
                    <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="truncate text-sm font-semibold">{profile?.full_name || user.email}</p>
                    <p className="truncate text-xs font-normal text-gray-500">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      {t("nav.profile", "Profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet">
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout", "Logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <LanguageSwitcher className="hidden sm:block" />
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t("nav.login", "Login")}</Link>
              </Button>
              <Button asChild variant="brand" size="sm" className="shadow-md shadow-brand-500/20">
                <Link href="/register">{t("nav.sell", "Sign Up")}</Link>
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-200/60 bg-white/90 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              <form action="/listings" method="GET" className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  name="q"
                  placeholder={t("common.search", "Search...")}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
                  className="block rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("nav.sell", "Sell")}
                </Link>
              )}
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
