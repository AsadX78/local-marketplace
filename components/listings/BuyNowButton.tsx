"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface BuyNowButtonProps {
  listingId: string;
  price: number;
  sellerId: string;
  isSold: boolean;
}

export function BuyNowButton({ listingId, price, sellerId, isSold }: BuyNowButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setCurrentUserId(data.user?.id || null);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Payment failed");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) return null;
  if (isSold) return null;
  if (!currentUserId) {
    return (
      <Button variant="brand" size="lg" className="w-full" asChild>
        <a href={`/login?redirect=/listings/${listingId}`}>Login to Buy</a>
      </Button>
    );
  }
  if (currentUserId === sellerId) return null;

  return (
    <Button
      variant="brand"
      size="lg"
      className="w-full"
      onClick={handleBuy}
      disabled={loading}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Buy Now — {(price * 1.05).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
        </>
      )}
    </Button>
  );
}
