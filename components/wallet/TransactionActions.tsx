"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TransactionActionsProps {
  transactionId: string;
  status: string;
  isBuyer: boolean;
  isSeller: boolean;
  onStatusChange: () => void;
}

export function TransactionActions({
  transactionId,
  status,
  isBuyer,
  isSeller,
  onStatusChange,
}: TransactionActionsProps) {
  const [loading, setLoading] = React.useState<string | null>(null);

  async function handleAction(action: string) {
    setLoading(action);
    try {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Action failed");
        return;
      }

      toast.success(data.message || "Done!");
      onStatusChange();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  // Buyer: in escrow → can confirm delivery
  if (status === "escrow" && isBuyer) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => handleAction("confirm_delivery")}
        disabled={loading === "confirm_delivery"}
      >
        {loading === "confirm_delivery" ? <Spinner size="sm" /> : <Package className="h-3 w-3" />}
        Confirm Delivery
      </Button>
    );
  }

  // Seller: delivered → can confirm receipt (releases payment)
  if (status === "delivered" && isSeller) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => handleAction("confirm_received")}
        disabled={loading === "confirm_received"}
      >
        {loading === "confirm_received" ? <Spinner size="sm" /> : <CheckCircle className="h-3 w-3" />}
        Confirm & Release Payment
      </Button>
    );
  }

  // Either party: escrow or delivered → can dispute
  if ((status === "escrow" || status === "delivered") && (isBuyer || isSeller)) {
    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleAction("dispute")}
        disabled={loading === "dispute"}
      >
        {loading === "dispute" ? <Spinner size="sm" /> : <AlertTriangle className="h-3 w-3" />}
        Dispute
      </Button>
    );
  }

  return null;
}
