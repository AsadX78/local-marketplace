"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { timeAgo } from "@/lib/utils";
import { Shield, Ban } from "lucide-react";
import type { Profile } from "@/lib/types";

export default function AdminUsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "admins" | "sellers">("all");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  async function loadUsers() {
    setLoading(true);
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/admin/users${params}`);
    if (res.ok) {
      const { data } = await res.json();
      setUsers((data as Profile[]) || []);
    }
    setLoading(false);
  }

  async function toggleAdmin(userId: string, currentStatus: boolean) {
    setActionLoading(userId);
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, is_admin: !currentStatus }),
    });
    await loadUsers();
    setActionLoading(null);
  }

  const filtered = users.filter((u) => {
    if (filter === "admins") return u.is_admin;
    if (filter === "sellers") return u.is_seller;
    return true;
  });

  if (!isAdmin) {
    return <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Access denied.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="sellers">Sellers</TabsTrigger>
            </TabsList>
          </Tabs>
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadUsers()}
            className="w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex py-20 justify-center"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No users found.</div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
              {filtered.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
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
