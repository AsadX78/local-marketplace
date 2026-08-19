"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface StripeOnboardButtonProps {
  hasStripeAccount: boolean;
}

export function StripeOnboardButton({ hasStripeAccount }: StripeOnboardButtonProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleOnboard() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/onboard", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Onboarding failed");
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

  return (
    <div className="flex items-center gap-3">
      {hasStripeAccount && (
        <div className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Payments connected</span>
        </div>
      )}
      <Button
        variant={hasStripeAccount ? "outline" : "brand"}
        size="sm"
        onClick={handleOnboard}
        disabled={loading}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            {hasStripeAccount ? "Update Stripe Settings" : "Set Up Payments"}
          </>
        )}
      </Button>
    </div>
  );
}
