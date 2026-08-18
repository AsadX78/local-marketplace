import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("listings")
    .select("*, profile:profiles!listings_user_id_fkey(*), category:categories!listings_category_id_fkey(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Increment view count (fire and forget)
  supabase.rpc("increment_views", { listing_id: id });

  return NextResponse.json({ data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerClientInstance();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership or admin
  const { data: listing } = await supabase
    .from("listings")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (listing.user_id !== user.id && !profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  // Only admin can change status
  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title.trim().slice(0, 200);
  if (body.description !== undefined) updateData.description = body.description.trim().slice(0, 5000);
  if (body.price !== undefined) updateData.price = body.price ? Math.max(0, parseFloat(body.price)) : null;
  if (body.price_negotiable !== undefined) updateData.price_negotiable = body.price_negotiable;
  if (body.images !== undefined) updateData.images = body.images;
  if (body.location_state !== undefined) updateData.location_state = body.location_state;
  if (body.location_lga !== undefined) updateData.location_lga = body.location_lga;
  if (body.location_address !== undefined) updateData.location_address = body.location_address;
  if (body.latitude !== undefined) updateData.latitude = body.latitude;
  if (body.longitude !== undefined) updateData.longitude = body.longitude;
  if (profile?.is_admin && body.status !== undefined) {
    updateData.status = body.status;
    if (body.admin_note) updateData.admin_note = body.admin_note;
  }

  const { data: updated, error } = await supabase
    .from("listings")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerClientInstance();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (listing.user_id !== user.id && !profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("listings").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
