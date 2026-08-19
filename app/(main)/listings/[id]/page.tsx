import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Eye,
  Heart,
  Flag,
  Share2,
  Shield,
  Star,
  ChevronRight,
} from "lucide-react";
import { createServerClientInstance } from "@/lib/supabase/server";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ImageCarousel } from "@/components/listings/ImageCarousel";
import { MapView } from "@/components/listings/MapViewLoader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BuyNowButton } from "@/components/listings/BuyNowButton";

export const dynamicRoute = "force-dynamic";

async function getListing(id: string) {
  try {
    const supabase = await createServerClientInstance();
    const { data } = await supabase
      .from("listings")
      .select("*, profile:profiles(*), category:categories(*)")
      .eq("id", id)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getSellerReviews(sellerId: string) {
  try {
    const supabase = await createServerClientInstance();
    const { data } = await supabase
      .from("reviews")
      .select("*, reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)")
      .eq("reviewed_id", sellerId)
      .order("created_at", { ascending: false })
      .limit(5);
    return data || [];
  } catch {
    return [];
  }
}

async function getSimilarListings(categoryId: string, currentId: string) {
  try {
    const supabase = await createServerClientInstance();
    const { data } = await supabase
      .from("listings")
      .select("*, profile:profiles!listings_user_id_fkey(full_name, avatar_url)")
      .eq("status", "approved")
      .eq("category_id", categoryId)
      .neq("id", currentId)
      .order("created_at", { ascending: false })
      .limit(4);
    return data || [];
  } catch {
    return [];
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) notFound();

  const [reviews, similarListings] = await Promise.all([
    getSellerReviews(listing.user_id),
    getSimilarListings(listing.category_id, listing.id),
  ]);

  const seller = listing.profile;
  const category = listing.category;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
        reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/listings" className="hover:text-gray-700">Listings</Link>
        <ChevronRight className="h-4 w-4" />
        {category && (
          <>
            <Link
              href={`/categories/${category.slug}`}
              className="hover:text-gray-700"
            >
              {(category.name as Record<string, string>)?.en || "Category"}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="line-clamp-1 font-medium text-gray-900">
          {listing.title}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: images + details */}
        <div className="space-y-6">
          <ImageCarousel images={listing.images || []} alt={listing.title} />

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            {listing.status === "pending" && (
              <Badge variant="warning">Pending Admin Approval</Badge>
            )}
            {listing.status === "sold" && (
              <Badge variant="secondary">Sold</Badge>
            )}
            {listing.is_featured && (
              <Badge variant="featured">⭐ Featured</Badge>
            )}
            <Badge variant="outline">{listing.views_count} views</Badge>
          </div>

          {/* Title + price */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {listing.title}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-700">
                {formatPrice(listing.price, listing.currency)}
              </span>
              {listing.price_negotiable && (
                <Badge variant="secondary">Negotiable</Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <ScrollReveal>
            <div className="rounded-xl bg-white border border-gray-200 p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>
          </ScrollReveal>

          {/* Location + map */}
          <ScrollReveal>
            <div className="rounded-xl bg-white border border-gray-200 p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Location</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4" />
                {listing.location_lga && <span>{listing.location_lga},</span>}
                {listing.location_state && <span>{listing.location_state}</span>}
                {!listing.location_state && <span>Nigeria</span>}
              </div>
              {listing.latitude && listing.longitude ? (
                <MapView
                  lat={listing.latitude}
                  lng={listing.longitude}
                  popup={listing.title}
                />
              ) : (
                <div className="h-[256px] flex items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  <MapPin className="mr-2 h-5 w-5" /> Location not set
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Reviews */}
          <ScrollReveal>
            <div className="rounded-xl bg-white border border-gray-200 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Seller Reviews ({reviews.length})
              </h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review: {
                  id: string;
                  rating: number;
                  comment: string;
                  created_at: string;
                  reviewer?: { full_name: string; avatar_url: string };
                }) => (
                  <div key={review.id} className="flex gap-3">
                    <Avatar
                      src={review.reviewer?.avatar_url}
                      alt={review.reviewer?.full_name || "Reviewer"}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {review.reviewer?.full_name || "Anonymous"}
                        </span>
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
                        <span className="text-xs text-gray-400">
                          {timeAgo(review.created_at)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet for this seller.</p>
            )}
            </div>
          </ScrollReveal>
        </div>

        {/* Right: seller card + actions */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:h-fit">
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" size="lg" asChild>
              <Link href={`/chat?listing=${listing.id}`}>Contact Seller</Link>
            </Button>
            <Button variant="outline" size="icon" aria-label="Save">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Buy Now button */}
          {listing.price && listing.price > 0 && listing.status === "approved" && (
            <BuyNowButton
              listingId={listing.id}
              price={listing.price}
              sellerId={listing.user_id}
              isSold={listing.status === "sold"}
            />
          )}

          {/* Payment info */}
          {listing.price && listing.price > 0 && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Item Price</span>
                  <span className="font-medium">{formatPrice(listing.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform Fee (5%)</span>
                  <span className="font-medium text-accent-600">
                    {formatPrice(listing.price * 0.05)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold">
                  <span>You Pay</span>
                  <span className="text-brand-700">
                    {formatPrice(listing.price * 1.05)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                  <Shield className="h-4 w-4 text-brand-600" />
                  Escrow-protected payment
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seller info */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Avatar
                  src={seller?.avatar_url}
                  alt={seller?.full_name || "Seller"}
                  fallback={seller?.full_name?.charAt(0) || "S"}
                  size="lg"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {seller?.full_name || "Seller"}
                  </p>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{avgRating.toFixed(1)}</span>
                      <span className="text-gray-400">({reviews.length} reviews)</span>
                    </div>
                  )}
                  {seller?.location_state && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {seller.location_state}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                Member since {new Date(seller?.created_at || "").getFullYear()}
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href={`/profile/${seller?.id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Report */}
          <Button variant="ghost" className="w-full text-gray-500" size="sm">
            <Flag className="h-4 w-4 mr-1.5" />
            Report this listing
          </Button>
        </div>
      </div>

      {/* Similar Listings */}
      {similarListings.length > 0 && (
        <ScrollReveal>
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Similar Listings</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similarListings.map((s: { id: string; title: string; images: string[]; price: number; currency: string; created_at: string; location_state: string; location_lga: string; profile?: { full_name: string; avatar_url: string }; category?: Record<string, unknown>; price_negotiable: boolean }) => (
              <Link
                key={s.id}
                href={`/listings/${s.id}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.images?.[0]}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-brand-700">
                    {formatPrice(s.price, s.currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
}
