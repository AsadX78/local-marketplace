"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import type { Transaction } from "@/lib/types";

export default function WalletPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    loadTransactions();
  }, [user]);

  async function loadTransactions() {
    const supabase = createClient();
    const { data } = await supabase
      .from("transactions")
      .select("*, listing:listings(title), buyer:profiles!transactions_buyer_id_fkey(full_name), seller:profiles!transactions_seller_id_fkey(full_name)")
      .or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`)
      .order("created_at", { ascending: false });
    setTransactions((data as Transaction[]) || []);
    setLoading(false);
  }

  const totalSpent = transactions
    .filter((t) => t.buyer_id === user?.id && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount), 0);

  const totalEarned = transactions
    .filter((t) => t.seller_id === user?.id && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount) - Number(t.commission_amount), 0);

  const pendingAmount = transactions
    .filter((t) => t.seller_id === user?.id && t.status === "escrow")
    .reduce((s, t) => s + Number(t.amount) - Number(t.commission_amount), 0);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    escrow: "bg-blue-100 text-blue-800",
    delivered: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    disputed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Please login to access your wallet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Wallet</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <ArrowDownLeft className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Earned</p>
                <p className="text-lg font-bold text-gray-900">{formatPrice(totalEarned)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">In Escrow</p>
                <p className="text-lg font-bold text-gray-900">{formatPrice(pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <ArrowUpRight className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="text-lg font-bold text-gray-900">{formatPrice(totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex py-8 justify-center"><Spinner /></div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Wallet className="mx-auto h-10 w-10" />
              <p className="mt-3 text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      tx.buyer_id === user.id ? "bg-red-100" : "bg-green-100"
                    }`}>
                      {tx.buyer_id === user.id ? (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tx.listing?.title || "Transaction"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tx.buyer_id === user.id ? `To: ${tx.seller?.full_name}` : `From: ${tx.buyer?.full_name}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      tx.buyer_id === user.id ? "text-red-600" : "text-green-600"
                    }`}>
                      {tx.buyer_id === user.id ? "-" : "+"}
                      {formatPrice(Number(tx.amount) - (tx.buyer_id === user.id ? 0 : Number(tx.commission_amount)))}
                    </p>
                    <Badge className={statusColors[tx.status] || ""}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
