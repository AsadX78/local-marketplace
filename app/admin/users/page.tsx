"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { timeAgo } from "@/lib/utils";
import { Shield, Ban, UserCheck } from "lucide-react";
import type { Profile } from "@/lib/types";

export default function AdminUsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  async function loadUsers() {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (search) {
      query = query.ilike("full_name", `%${search}%`);
    }

    const { data } = await query;
    setUsers((data as Profile[]) || []);
    setLoading(false);
  }

  async function toggleAdmin(userId: string, currentStatus: boolean) {
    setActionLoading(userId);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ is_admin: !currentStatus })
      .eq("id", userId);
    await loadUsers();
    setActionLoading(null);
  }

  if (!isAdmin) {
    return <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Access denied.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <div className="relative w-72">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadUsers()}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex py-20 justify-center"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">User</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Location</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Joined</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar_url ?? undefined} alt={user.full_name ?? undefined} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.full_name || "Unnamed"}</p>
                        <p className="text-xs text-gray-500">{user.phone || "No phone"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.location_state || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {timeAgo(user.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {user.is_admin && <Badge variant="default">Admin</Badge>}
                      {user.is_seller && <Badge variant="success">Seller</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant={user.is_admin ? "destructive" : "ghost"}
                      size="sm"
                      onClick={() => toggleAdmin(user.id, user.is_admin || false)}
                      disabled={actionLoading === user.id}
                    >
                      {actionLoading === user.id ? (
                        <Spinner size="sm" />
                      ) : user.is_admin ? (
                        <><Ban className="mr-1 h-3 w-3" />Revoke Admin</>
                      ) : (
                        <><Shield className="mr-1 h-3 w-3" />Make Admin</>
                      )}
                    </Button>
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
