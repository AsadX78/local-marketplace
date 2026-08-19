"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { NIGERIAN_STATES, LANGUAGES } from "@/lib/constants";

export default function SettingsPage() {
  const { user, profile, setProfile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [avatarLoading, setAvatarLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    location_state: profile?.location_state || "",
    location_lga: profile?.location_lga || "",
    preferred_language: profile?.preferred_language || "en",
    is_seller: profile?.is_seller || false,
  });

  React.useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location_state: profile.location_state || "",
        location_lga: profile.location_lga || "",
        preferred_language: profile.preferred_language || "en",
        is_seller: profile.is_seller || false,
      });
    }
  }, [profile]);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const { error: errMsg } = await res.json();
        throw new Error(errMsg || "Upload failed");
      }
      const { url } = await res.json();
      setProfile({ ...profile!, avatar_url: url });
      setMessage("Avatar updated!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setAvatarLoading(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error: errMsg } = await res.json();
        throw new Error(errMsg || "Update failed");
      }
      setProfile({ ...profile!, ...form });
      setMessage("Profile updated successfully!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  const selectedState = NIGERIAN_STATES.find((s) => s.name === form.location_state);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile Settings</h1>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-6">
        {/* Avatar */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar
                src={profile?.avatar_url ?? undefined}
                alt={profile?.full_name ?? undefined}
                fallback={profile?.full_name?.charAt(0) ?? undefined}
                size="xl"
              />
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" asChild disabled={avatarLoading}>
                    <span>{avatarLoading ? <Spinner size="sm" /> : "Change Photo"}</span>
                  </Button>
                </label>
                <p className="mt-1 text-xs text-gray-400">JPG, PNG, or WebP. Max 5MB.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+234 801 234 5678"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                maxLength={500}
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="Tell buyers about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>State</Label>
              <Select
                value={form.location_state}
                onChange={(e) => {
                  update("location_state", e.target.value);
                  update("location_lga", "");
                }}
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            {selectedState && (
              <div>
                <Label>LGA</Label>
                <Select
                  value={form.location_lga}
                  onChange={(e) => update("location_lga", e.target.value)}
                >
                  <option value="">Select LGA</option>
                  {selectedState.lgAs.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Preferred Language</Label>
              <Select
                value={form.preferred_language}
                onChange={(e) => update("preferred_language", e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </Select>
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_seller}
                onChange={(e) => update("is_seller", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600"
              />
              <div>
                <span className="font-medium">I want to sell</span>
                <p className="text-xs text-gray-400">
                  Enable selling features and Stripe Connect onboarding
                </p>
              </div>
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="brand" onClick={handleSave} disabled={loading} className="px-8">
            {loading ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
