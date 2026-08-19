import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClientInstance>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { user };
}

export async function GET(request: NextRequest) {
  const supabase = await createServerClientInstance();
  const admin = await requireAdmin(supabase);
  if ("error" in admin) return admin.error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerClientInstance();
  const admin = await requireAdmin(supabase);
  if ("error" in admin) return admin.error;

  const body = await request.json();
  if (!body.user_id || typeof body.is_admin !== "boolean") {
    return NextResponse.json({ error: "user_id and is_admin required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_admin: body.is_admin })
    .eq("id", body.user_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
