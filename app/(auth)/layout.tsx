import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute right-10 top-1/2 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        </div>
        <Link href="/" className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl font-bold text-white">
            L
          </div>
          <span className="text-xl font-bold text-white">LocalMarketNG</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-bold text-white">Buy & Sell Across Nigeria</h2>
          <p className="mt-4 text-lg text-brand-100">
            Join thousands of Nigerians trading safely with escrow-protected payments.
          </p>
          <div className="mt-8 space-y-3 text-brand-50">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                ✓
              </span>
              <span>5% platform fee — lowest in Nigeria</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                ✓
              </span>
              <span>Admin-verified listings</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                ✓
              </span>
              <span>Secure escrow payments via Stripe</span>
            </div>
          </div>
        </div>
        <p className="relative text-sm text-brand-200">
          © 2026 LocalMarket NG. Made for Nigerians, by Nigerians.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
