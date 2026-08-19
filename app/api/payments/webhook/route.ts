import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createServiceRoleClient, getStripe } from "@/lib/supabase/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { listing_id, buyer_id, seller_id } = session.metadata || {};

      if (listing_id && buyer_id && seller_id) {
        // Update transaction to escrow
        await supabase
          .from("transactions")
          .update({ status: "escrow" })
          .eq("stripe_payment_intent", session.payment_intent as string)
          .eq("status", "pending");

        // Mark listing as sold
        await supabase
          .from("listings")
          .update({ status: "sold" })
          .eq("id", listing_id);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await supabase
        .from("transactions")
        .update({ status: "refunded" })
        .eq("stripe_payment_intent", intent.id);
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      // Transaction already moved to escrow in checkout.session.completed
      break;
    }
  }

  return NextResponse.json({ received: true });
}
