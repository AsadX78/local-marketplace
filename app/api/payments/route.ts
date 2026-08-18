import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
});

const COMMISSION_RATE = 0.05;

export async function POST(request: NextRequest) {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.listing_id) {
    return NextResponse.json({ error: "listing_id required" }, { status: 400 });
  }

  // Fetch listing and seller
  const { data: listing } = await supabase
    .from("listings")
    .select("*, profile:profiles!listings_user_id_fkey(stripe_account_id, full_name)")
    .eq("id", body.listing_id)
    .eq("status", "approved")
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found or not approved" }, { status: 404 });
  }

  if (!listing.price || listing.price <= 0) {
    return NextResponse.json({ error: "This listing has no price set" }, { status: 400 });
  }

  if (listing.user_id === user.id) {
    return NextResponse.json({ error: "Cannot buy your own listing" }, { status: 400 });
  }

  if (!listing.profile?.stripe_account_id) {
    return NextResponse.json(
      { error: "Seller has not set up payments yet" },
      { status: 400 }
    );
  }

  const amount = Math.round(listing.price * 100); // Convert to kobo
  const commission = Math.round(amount * COMMISSION_RATE);
  const sellerAmount = amount - commission;

  try {
    // Create Stripe Checkout Session with Connect
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "ngn",
            product_data: {
              name: listing.title,
              images: listing.images?.slice(0, 1) || [],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: commission,
        transfer_data: {
          destination: listing.profile.stripe_account_id,
        },
        metadata: {
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.user_id,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/listings/${listing.id}?cancelled=true`,
      metadata: {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.user_id,
      },
    });

    // Create pending transaction
    await supabase.from("transactions").insert({
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.user_id,
      amount: listing.price,
      commission_amount: listing.price * COMMISSION_RATE,
      stripe_payment_intent: session.payment_intent as string,
      status: "pending",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
