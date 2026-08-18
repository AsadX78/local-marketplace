import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createServerClientInstance();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.seller_id || !body.listing_id) {
    return NextResponse.json({ error: "seller_id and listing_id required" }, { status: 400 });
  }

  if (body.seller_id === user.id) {
    return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });
  }

  // Check existing conversation
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", body.listing_id)
    .eq("buyer_id", user.id)
    .eq("seller_id", body.seller_id)
    .single();

  if (existing) return NextResponse.json({ data: existing });

  const { data, error } = await supabase
    .from("conversations")
    .insert({ listing_id: body.listing_id, buyer_id: user.id, seller_id: body.seller_id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function GET() {
  const supabase = await createServerClientInstance();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      buyer:profiles!conversations_buyer_id_fkey(full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(full_name, avatar_url),
      listing:listings(id, title, price, images, status)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
