"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, timeAgo } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

type StatusFilter = "all" | "pending" | "escrow" | "completed" | "disputed";

export default function AdminTransactionsPage() {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<StatusFilter>("all");

  React.useEffect(() => {
    if (isAdmin) loadTransactions();
  }, [isAdmin]);

  async function loadTransactions() {
    setLoading(true);
    const res = await fetch("/api/admin/transactions");
    if (res.ok) {
      const { data } = await res.json();
      setTransactions((data as Transaction[]) || []);
    }
    setLoading(false);
  }

  const filtered = transactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.status === filter;
  });

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

  const counts = {
    all: transactions.length,
    pending: transactions.filter((t) => t.status === "pending").length,
    escrow: transactions.filter((t) => t.status === "escrow").length,
    completed: transactions.filter((t) => t.status === "completed").length,
    disputed: transactions.filter((t) => t.status === "disputed").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value="escrow">Escrow ({counts.escrow})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({counts.completed})</TabsTrigger>
            <TabsTrigger value="disputed">Disputed ({counts.disputed})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex py-20 justify-center"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No transactions found.</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
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
              {filtered.map((tx) => (
                <tr key={tx.id} className="transition-colors hover:bg-gray-50/50">
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
