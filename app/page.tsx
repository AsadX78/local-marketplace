import Link from "next/link";
import { Search, Shield, Zap, Star, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/listings/CategoryGrid";
import { ListingCard } from "@/components/listings/ListingCard";
import { createServerClientInstance } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getFeaturedListings(): Promise<Listing[]> {
  try {
    const supabase = await createServerClientInstance();
    const { data } = await supabase
      .from("listings")
      .select("*, profile:profiles(*), category:categories(*)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(12);
    return (data as Listing[]) || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const listings = await getFeaturedListings();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
              <Star className="h-4 w-4 text-accent-300" />
              Nigeria&apos;s fastest-growing marketplace
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Buy &amp; Sell Anything,
              <br />
              <span className="text-accent-300">Anywhere in Nigeria</span>
            </h1>
            <p className="mt-6 text-lg text-brand-100">
              From phones in Lagos to land in Kano. Safe escrow payments, verified
              sellers, and zero listing fees. We only take 5% when you sell.
            </p>

            <form
              action="/listings"
              method="GET"
              className="mt-8 flex max-w-xl gap-2 rounded-2xl bg-white p-2 shadow-xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  name="q"
                  placeholder="What are you looking for?"
                  className="h-12 w-full rounded-xl pl-10 pr-4 text-gray-900 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="brand" size="lg" className="px-6">
                Search
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-100">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> 37 states covered
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> Escrow-protected
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Instant chat
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: "500K+", label: "Active Listings" },
            { value: "250K+", label: "Verified Users" },
            { value: "37", label: "States Covered" },
            { value: "5%", label: "Platform Fee" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-brand-700">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Browse Categories
            </h2>
            <p className="mt-2 text-gray-500">
              Find exactly what you need across Nigeria
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Latest Listings
              </h2>
              <p className="mt-2 text-gray-500">
                Fresh deals from sellers near you
              </p>
            </div>
            <Link
              href="/listings"
              className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:flex"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {listings.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} priority={i < 5} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-gray-500">
                No listings yet. Be the first to post!
              </p>
              <Button asChild variant="brand" className="mt-4">
                <Link href="/listings/create">Post a Listing</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          How LocalMarket NG Works
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Browse or Post",
              desc: "Find what you need or list your item in minutes. Admin reviews every listing for safety.",
            },
            {
              icon: Shield,
              title: "Pay with Escrow",
              desc: "Buyers pay into secure escrow. Funds release only when the deal is confirmed.",
            },
            {
              icon: Star,
              title: "Rate & Trust",
              desc: "Build your reputation. Sellers earn badges, buyers shop with confidence.",
            },
          ].map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <step.icon className="h-8 w-8" />
              </div>
              <div className="absolute -top-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-accent-500 to-accent-600 px-8 py-12 text-center shadow-xl sm:px-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to start selling?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-accent-50">
            Post your first listing for free. Only pay 5% when your item sells —
            the lowest fee in Nigeria.
          </p>
          <Button asChild size="lg" variant="default" className="mt-6 bg-white text-accent-700 hover:bg-accent-50">
            <Link href="/listings/create">Post a Free Listing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
