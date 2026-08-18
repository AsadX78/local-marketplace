"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar } from "@/components/ui/avatar";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Users, FileText, DollarSign, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalListings: number;
  pendingListings: number;
  totalTransactions: number;
  totalRevenue: number;
  openReports: number;
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAdmin) return;
    loadStats();
  }, [isAdmin]);

  async function loadStats() {
    const supabase = createClient();
    const [
      { count: totalUsers },
      { count: totalListings },
      { count: pendingListings },
      { count: totalTransactions },
      { data: revenueData },
      { count: openReports },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("transactions").select("*", { count: "exact", head: true }),
      supabase.from("transactions").select("commission_amount"),
      supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "open"),
    ]);

    const totalRevenue = (revenueData || [])
      .reduce((sum: number, t: { commission_amount: number }) => sum + Number(t.commission_amount || 0), 0);

    setStats({
      totalUsers: totalUsers || 0,
      totalListings: totalListings || 0,
      pendingListings: pendingListings || 0,
      totalTransactions: totalTransactions || 0,
      totalRevenue,
      openReports: openReports || 0,
    });
    setLoading(false);
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Access denied. Admin only.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {loading ? (
        <div className="flex py-20 justify-center"><Spinner size="lg" /></div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
                    <Users className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Users</p>
                    <p className="text-xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Listings</p>
                    <p className="text-xl font-bold">{stats.totalListings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pending Review</p>
                    <p className="text-xl font-bold">{stats.pendingListings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenue (5%)</p>
                    <p className="text-xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transactions</p>
                    <p className="text-xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Open Reports</p>
                    <p className="text-xl font-bold">{stats.openReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Button asChild variant="outline" className="h-16 text-base">
              <Link href="/admin/listings">
                <FileText className="mr-2 h-5 w-5" />
                Manage Listings ({stats.pendingListings} pending)
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 text-base">
              <Link href="/admin/users">
                <Users className="mr-2 h-5 w-5" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 text-base">
              <Link href="/admin/reports">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Review Reports ({stats.openReports})
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 text-base">
              <Link href="/admin/transactions">
                <DollarSign className="mr-2 h-5 w-5" />
                Transaction History
              </Link>
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
