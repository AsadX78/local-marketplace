import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClientInstance();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("transactions")
    .select("*, listing:listings(title), buyer:profiles!transactions_buyer_id_fkey(full_name), seller:profiles!transactions_seller_id_fkey(full_name)")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
