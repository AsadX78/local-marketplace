import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { SearchFilters } from "@/components/search/SearchFilters";
import { createServerClientInstance } from "@/lib/supabase/server";
import type { Listing, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createServerClientInstance();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as Category) || null;
}

async function getListings(categoryId: string): Promise<Listing[]> {
  const supabase = await createServerClientInstance();
  const { data } = await supabase
    .from("listings")
    .select("*, profile:profiles(*), category:categories(*)")
    .eq("status", "approved")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
    .limit(60);
  return (data as Listing[]) || [];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const listings = await getListings(category.id);
  const name = (category.name as Record<string, string>).en;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/categories" className="hover:text-gray-700">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">{name}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {listings.length} listings in {name}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <SearchFilters initialCategory={category.id} />
        </aside>

        <div>
          {listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
              <p className="text-gray-500">No listings in this category yet.</p>
              <Link
                href="/listings/create"
                className="mt-4 inline-block font-semibold text-brand-600 hover:underline"
              >
                Be the first to post →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
