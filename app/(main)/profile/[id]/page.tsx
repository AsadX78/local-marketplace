import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Star } from "lucide-react";
import { createServerClientInstance } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/listings/ListingCard";
import type { Listing, Review } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getProfile(id: string) {
  try {
    const supabase = await createServerClientInstance();
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    return data;
  } catch {
    return null;
  }
}

async function getListings(userId: string) {
  try {
    const supabase = await createServerClientInstance();
    const { data } = await supabase
      .from("listings")
      .select("*, profile:profiles!listings_user_id_fkey(full_name, avatar_url)")
      .eq("user_id", userId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20);
    return (data as Listing[]) || [];
  } catch {
    return [];
  }
}

async function getReviews(userId: string) {
  try {
    const supabase = await createServerClientInstance();
    const { data } = await supabase
      .from("reviews")
      .select("*, reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)")
      .eq("reviewed_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    return (data || []) as (Review & { reviewer?: { full_name: string; avatar_url: string } })[];
  } catch {
    return [];
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [profile, listings, reviews] = await Promise.all([
    getProfile(id),
    getListings(id),
    getReviews(id),
  ]);

  if (!profile) notFound();

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s: number, r: Review) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Profile Header */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar
            src={profile.avatar_url}
            alt={profile.full_name}
            fallback={profile.full_name?.charAt(0)}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.full_name || "Unnamed User"}
              </h1>
              {profile.is_seller && <Badge variant="success">Verified Seller</Badge>}
            </div>
            {avgRating > 0 && (
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400">({reviews.length} reviews)</span>
              </div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {profile.location_state && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {profile.location_state}
                  {profile.location_lga && `, ${profile.location_lga}`}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {new Date(profile.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "long" })}
              </span>
            </div>
            {profile.bio && (
              <p className="mt-4 text-sm text-gray-600">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Listings */}
      <section className="mt-10">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          Listings ({listings.length})
        </h2>
        {listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No listings yet.</p>
        )}
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Reviews ({reviews.length})
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-xl bg-white border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={review.reviewer?.avatar_url}
                    alt={review.reviewer?.full_name}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.reviewer?.full_name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
