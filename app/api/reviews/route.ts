import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = await createServerClientInstance();

  const userId = searchParams.get("user_id");
  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*, reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)")
    .eq("reviewed_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.transaction_id || !body.rating || !body.reviewed_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  // Verify the transaction exists and buyer is the reviewer
  const { data: tx } = await supabase
    .from("transactions")
    .select("id, buyer_id, status")
    .eq("id", body.transaction_id)
    .single();

  if (!tx) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  if (tx.buyer_id !== user.id) {
    return NextResponse.json({ error: "Only the buyer can leave a review" }, { status: 403 });
  }

  if (tx.status !== "completed") {
    return NextResponse.json({ error: "Can only review after transaction is completed" }, { status: 400 });
  }

  // Check for duplicate
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("reviewer_id", user.id)
    .eq("transaction_id", body.transaction_id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "You already reviewed this transaction" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      reviewer_id: user.id,
      reviewed_id: body.reviewed_id,
      transaction_id: body.transaction_id,
      rating: Math.round(body.rating),
      comment: body.comment?.trim().slice(0, 1000) || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
