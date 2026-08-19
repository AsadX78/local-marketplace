import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClientInstance>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { user };
}

export async function GET() {
  const supabase = await createServerClientInstance();
  const admin = await requireAdmin(supabase);
  if ("error" in admin) return admin.error;

  const { data, error } = await supabase
    .from("reports")
    .select("*, reporter:profiles!reports_reporter_id_fkey(full_name, avatar_url), listing:listings!reports_listing_id_fkey(title, id)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerClientInstance();
  const admin = await requireAdmin(supabase);
  if ("error" in admin) return admin.error;

  const body = await request.json();
  if (!body.report_id) {
    return NextResponse.json({ error: "report_id required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("reports")
    .update({ status: "resolved" })
    .eq("id", body.report_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
