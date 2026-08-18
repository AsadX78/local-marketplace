"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { timeAgo } from "@/lib/utils";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { Report } from "@/lib/types";

export default function AdminReportsPage() {
  const { isAdmin } = useAuth();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAdmin) loadReports();
  }, [isAdmin]);

  async function loadReports() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("reports")
      .select("*, reporter:profiles!reports_reporter_id_fkey(full_name, avatar_url), listing:listings!reports_listing_id_fkey(title, id)")
      .order("created_at", { ascending: false });
    setReports((data as Report[]) || []);
    setLoading(false);
  }

  async function resolveReport(id: string) {
    setActionLoading(id);
    const supabase = createClient();
    await supabase
      .from("reports")
      .update({ status: "resolved" })
      .eq("id", id);
    await loadReports();
    setActionLoading(null);
  }

  if (!isAdmin) {
    return <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Access denied.</div>;
  }

  const statusColors: Record<string, string> = {
    open: "bg-red-100 text-red-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Reports</h1>

      {loading ? (
        <div className="flex py-20 justify-center"><Spinner size="lg" /></div>
      ) : reports.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <AlertTriangle className="mx-auto h-10 w-10" />
          <p className="mt-3">No reports yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
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
