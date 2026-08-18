import Link from "next/link";
import { SearchX } from "lucide-react";
import { SearchFilters } from "@/components/search/SearchFilters";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { createServerClientInstance } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

interface ListingsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    state?: string;
    min?: string;
    max?: string;
    sort?: string;
    nego?: string;
    page?: string;
  }>;
}

async function getListings(filters: {
  q?: string;
  category?: string;
  state?: string;
  min?: string;
  max?: string;
  sort?: string;
  nego?: string;
}): Promise<Listing[]> {
  try {
    const supabase = await createServerClientInstance();
    let query = supabase
      .from("listings")
      .select("*, profile:profiles(*), category:categories(*)")
      .eq("status", "approved");

    if (filters.q) {
      query = query.textSearch("search_vector", filters.q, {
        type: "websearch",
        config: "english",
      });
    }
    if (filters.category) {
      query = query.eq("category_id", filters.category);
    }
    if (filters.state) {
      query = query.eq("location_state", filters.state);
    }
    if (filters.min) {
      query = query.gte("price", parseFloat(filters.min));
    }
    if (filters.max) {
      query = query.lte("price", parseFloat(filters.max));
    }
    if (filters.nego === "1") {
      query = query.eq("price_negotiable", true);
    }

    switch (filters.sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data } = await query.limit(60);
    return (data as Listing[]) || [];
  } catch {
    return [];
  }
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const sp = await searchParams;
  const listings = await getListings(sp);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {sp.q ? `Results for "${sp.q}"` : "All Listings"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {listings.length} {listings.length === 1 ? "listing" : "listings"} found
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <SearchFilters />
        </aside>

        {/* Results */}
        <div>
          {listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
              <SearchX className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No listings match your filters.</p>
              <Button asChild variant="brand" className="mt-4">
                <Link href="/listings">Browse all listings</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
