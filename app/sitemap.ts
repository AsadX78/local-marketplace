import { MetadataRoute } from "next";
import { createServerClientInstance } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://localmarket.ng";
  try {
    const supabase = await createServerClientInstance();
    const { data: listings } = await supabase
      .from("listings")
      .select("id, updated_at")
      .eq("status", "approved")
      .limit(5000);
    const { data: categories } = await supabase
      .from("categories")
      .select("slug");

    const listingUrls = (listings || []).map((l) => ({
      url: `${base}/listings/${l.id}`,
      lastModified: new Date(l.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

    const categoryUrls = (categories || []).map((c) => ({
      url: `${base}/categories/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [
      { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${base}/listings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${base}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
      ...listingUrls,
      ...categoryUrls,
    ];
  } catch {
    return [{ url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 }];
  }
}
