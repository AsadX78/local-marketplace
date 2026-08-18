"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, timeAgo } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

export default function AdminTransactionsPage() {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isAdmin) loadTransactions();
  }, [isAdmin]);

  async function loadTransactions() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("transactions")
      .select("*, listing:listings(title), buyer:profiles!transactions_buyer_id_fkey(full_name), seller:profiles!transactions_seller_id_fkey(full_name)")
      .order("created_at", { ascending: false })
      .limit(100);
    setTransactions((data as Transaction[]) || []);
    setLoading(false);
  }

  if (!isAdmin) {
    return <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Access denied.</div>;
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    escrow: "bg-blue-100 text-blue-800",
    delivered: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    disputed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Transactions</h1>

      {loading ? (
        <div className="flex py-20 justify-center"><Spinner size="lg" /></div>
      ) : transactions.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No transactions yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-gray-200 bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Item</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Buyer</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Seller</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Fee (5%)</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate">
                    {tx.listing?.title || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {tx.buyer?.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {tx.seller?.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatPrice(Number(tx.amount))}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-accent-600">
                    {formatPrice(Number(tx.commission_amount))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={statusColors[tx.status] || ""}>{tx.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {timeAgo(tx.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
