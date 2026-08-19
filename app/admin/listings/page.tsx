"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatPrice, timeAgo } from "@/lib/utils";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import type { Listing } from "@/lib/types";

export default function AdminListingsPage() {
  const { isAdmin } = useAuth();
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [rejectModal, setRejectModal] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAdmin) loadListings();
  }, [isAdmin, filter]);

  async function loadListings() {
    setLoading(true);
    const res = await fetch(`/api/admin/listings?status=${filter}`);
    if (res.ok) {
      const { data } = await res.json();
      setListings((data as Listing[]) || []);
    }
    setLoading(false);
  }

  async function approveListing(id: string) {
    setActionLoading(id);
    await fetch(`/api/listings/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    await loadListings();
    setActionLoading(null);
  }

  async function rejectListing(id: string) {
    setActionLoading(id);
    await fetch(`/api/listings/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", reason: rejectReason || "Does not meet guidelines" }),
    });
    setRejectModal(null);
    setRejectReason("");
    await loadListings();
    setActionLoading(null);
  }

  if (!isAdmin) {
    return <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Access denied.</div>;
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    sold: "bg-blue-100 text-blue-800",
    expired: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex py-20 justify-center"><Spinner size="lg" /></div>
      ) : listings.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No listings found.</div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
            >
              {listing.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.images[0]}
                  alt=""
                  className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                  📦
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-gray-900">
                    {listing.title}
                  </h3>
                  <Badge className={statusColors[listing.status] || ""}>{listing.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600 truncate">{listing.description}</p>
                <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                  <span>{formatPrice(listing.price, listing.currency)}</span>
                  <span>{listing.location_state || "Nigeria"}</span>
                  <span>{timeAgo(listing.created_at)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Avatar src={listing.profile?.avatar_url ?? undefined} alt={listing.profile?.full_name ?? undefined} size="sm" />
                  <span className="text-xs text-gray-600">{listing.profile?.full_name}</span>
                </div>
                {listing.admin_note && (
                  <p className="mt-2 text-xs text-red-600">Rejection note: {listing.admin_note}</p>
                )}
              </div>
              {listing.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => approveListing(listing.id)}
                    disabled={actionLoading === listing.id}
                  >
                    {actionLoading === listing.id ? <Spinner size="sm" /> : <><CheckCircle className="mr-1 h-4 w-4" />Approve</>}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setRejectModal(listing.id)}
                    disabled={actionLoading === listing.id}
                  >
                    <XCircle className="mr-1 h-4 w-4" />Reject
                  </Button>
                </div>
              )}
              <Button variant="ghost" size="sm" asChild>
                <a href={`/listings/${listing.id}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={!!rejectModal} onOpenChange={(open) => { if (!open) setRejectModal(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection (the seller will see this):
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={3}
            placeholder="e.g. Listing appears to be fraudulent / violates guidelines..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => rejectModal && rejectListing(rejectModal)}
              disabled={actionLoading === rejectModal}
            >
              Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
