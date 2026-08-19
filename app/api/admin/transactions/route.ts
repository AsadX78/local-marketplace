import { NextResponse } from "next/server";
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
    .from("transactions")
    .select("*, listing:listings(title), buyer:profiles!transactions_buyer_id_fkey(full_name), seller:profiles!transactions_seller_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
