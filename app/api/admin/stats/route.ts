import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    { count: totalUsers },
    { count: totalListings },
    { count: pendingListings },
    { count: totalTransactions },
    { count: openReports },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("transactions").select("commission_amount").eq("status", "completed"),
  ]);

  const totalRevenue = (revenueData || [])
    .reduce((sum: number, t: { commission_amount: number }) => sum + Number(t.commission_amount || 0), 0);

  return NextResponse.json({
    data: {
      totalUsers: totalUsers || 0,
      totalListings: totalListings || 0,
      pendingListings: pendingListings || 0,
      totalTransactions: totalTransactions || 0,
      totalRevenue,
      openReports: openReports || 0,
    },
  });
}
