import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/listings/CategoryGrid";
import { ListingCard } from "@/components/listings/ListingCard";
import { createServerClientInstance } from "@/lib/supabase/server";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeHowItWorks, HomeCTA } from "@/components/home/HomeSections";
import { MotionDiv } from "@/components/motion";
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
      <HomeHero />
      <HomeStats />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <MotionDiv variant="fadeUp" className="mb-8 flex items-end justify-between">
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
        </MotionDiv>
        <CategoryGrid />
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionDiv variant="fadeUp" className="mb-8 flex items-end justify-between">
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
          </MotionDiv>

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

      <HomeHowItWorks />
      <HomeCTA />
    </div>
  );
}
