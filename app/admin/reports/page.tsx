"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { timeAgo } from "@/lib/utils";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { Report } from "@/lib/types";

type StatusFilter = "all" | "open" | "reviewed" | "resolved";

export default function AdminReportsPage() {
  const { isAdmin } = useAuth();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<StatusFilter>("all");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAdmin) loadReports();
  }, [isAdmin]);

  async function loadReports() {
    setLoading(true);
    const res = await fetch("/api/admin/reports");
    if (res.ok) {
      const { data } = await res.json();
      setReports((data as Report[]) || []);
    }
    setLoading(false);
  }

  async function resolveReport(id: string) {
    setActionLoading(id);
    await fetch("/api/admin/reports", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_id: id }),
    });
    await loadReports();
    setActionLoading(null);
  }

  const filtered = reports.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  if (!isAdmin) {
    return <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Access denied.</div>;
  }

  const statusColors: Record<string, string> = {
    open: "bg-red-100 text-red-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
  };

  const counts = {
    all: reports.length,
    open: reports.filter((r) => r.status === "open").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="open">Open ({counts.open})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed ({counts.reviewed})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({counts.resolved})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex py-20 justify-center"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <AlertTriangle className="mx-auto h-10 w-10" />
          <p className="mt-3">No reports found</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50/50 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar
                    src={report.reporter?.avatar_url ?? undefined}
                    alt={report.reporter?.full_name ?? undefined}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {report.reporter?.full_name || "Anonymous"} reported:
                    </p>
                    <p className="mt-1 text-sm font-semibold text-red-700">{report.reason}</p>
                    {report.details && (
                      <p className="mt-1 text-sm text-gray-600">{report.details}</p>
                    )}
                    {report.listing && (
                      <a
                        href={`/listings/${report.listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline"
                      >
                        View Listing: {report.listing.title}
                      </a>
                    )}
                    <p className="mt-1 text-xs text-gray-400">{timeAgo(report.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[report.status] || ""}>{report.status}</Badge>
                  {report.status === "open" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => resolveReport(report.id)}
                      disabled={actionLoading === report.id}
                    >
                      {actionLoading === report.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <><CheckCircle className="mr-1 h-3 w-3" />Resolve</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
