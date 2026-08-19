import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Listing } from "@/lib/types";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
}

export function ListingCard({ listing, priority }: ListingCardProps) {
  const image = listing.images?.[0];
  const title = listing.title_i18n?.en || listing.title;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gray-200/50"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50 text-brand-400">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {listing.is_featured && (
          <Badge variant="featured" className="absolute left-3 top-3 shadow-lg">
            ⭐ Featured
          </Badge>
        )}
        {listing.price === null && (
          <Badge variant="secondary" className="absolute right-3 top-3 shadow-lg">
            Contact
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-brand-700">
            {title}
          </h3>
        </div>

        <p className="mt-2 text-lg font-bold text-brand-700">
          {formatPrice(listing.price, listing.currency)}
          {listing.price_negotiable && listing.price !== null && (
            <span className="ml-1 text-xs font-normal text-gray-400">nego</span>
          )}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {listing.location_lga || listing.location_state || "Nigeria"}
          </span>
          <span>{timeAgo(listing.created_at)}</span>
        </div>

        {listing.profile && (
          <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
            <Avatar
              src={listing.profile.avatar_url}
              alt={listing.profile.full_name || "Seller"}
              fallback={listing.profile.full_name?.charAt(0) || "S"}
              size="sm"
            />
            <span className="truncate text-xs text-gray-600">
              {listing.profile.full_name || "Seller"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/5" />
        </div>
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}
