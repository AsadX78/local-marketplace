import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = await createServerClientInstance();

  let query = supabase
    .from("listings")
    .select("*, profile:profiles!listings_user_id_fkey(full_name, avatar_url), category:categories!listings_category_id_fkey(name, slug)")
    .eq("status", "approved");

  const q = searchParams.get("q");
  if (q) {
    query = query.textSearch("search_vector", q, { type: "websearch", config: "english" });
  }

  const category = searchParams.get("category");
  if (category) query = query.eq("category_id", category);

  const state = searchParams.get("state");
  if (state) query = query.eq("location_state", state);

  const min = searchParams.get("min");
  if (min) query = query.gte("price", parseFloat(min));

  const max = searchParams.get("max");
  if (max) query = query.lte("price", parseFloat(max));

  const sort = searchParams.get("sort");
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 60);
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count: count || data?.length || 0, page, limit });
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

  // Validate required fields
  if (!body.title || !body.description || !body.category_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Sanitize inputs
  const sanitized = {
    user_id: user.id,
    category_id: body.category_id,
    title: body.title.trim().slice(0, 200),
    description: body.description.trim().slice(0, 5000),
    price: body.price ? Math.max(0, parseFloat(body.price)) : null,
    price_negotiable: !!body.price_negotiable,
    images: Array.isArray(body.images) ? body.images.slice(0, 10) : [],
    location_state: body.location_state || null,
    location_lga: body.location_lga || null,
    location_address: body.location_address?.trim().slice(0, 200) || null,
    latitude: body.latitude ? parseFloat(body.latitude) : null,
    longitude: body.longitude ? parseFloat(body.longitude) : null,
    status: "pending", // Force pending
  };

  const { data, error } = await supabase
    .from("listings")
    .insert(sanitized)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
