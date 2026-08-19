"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CATEGORY_SEED, NIGERIAN_STATES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X, ChevronRight } from "lucide-react";

export default function CreateListingPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [images, setImages] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [selectedState, setSelectedState] = React.useState("");
  const [categoryMap, setCategoryMap] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("id, slug")
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          (data as { slug: string; id: string }[]).forEach((c) => {
            map[c.slug] = c.id;
          });
          setCategoryMap(map);
        }
      });
  }, []);

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    price: "",
    priceNegotiable: true,
    category: "",
    subcategory: "",
    state: "",
    lga: "",
    address: "",
  });

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const valid = files.filter((f) => {
      if (!validTypes.includes(f.type)) return false;
      if (f.size > 5 * 1024 * 1024) return false;
      return true;
    });
    setImages((prev) => [...prev, ...valid]);
    valid.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(f);
    });
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!user) return;
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // Upload images
      const imageUrls: string[] = [];
      for (const img of images) {
        const ext = img.name.split(".").pop() || "jpg";
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("listings")
          .upload(fileName, img, { upsert: false });
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        const { data: urlData } = supabase.storage
          .from("listings")
          .getPublicUrl(uploadData.path);
        imageUrls.push(urlData.publicUrl);
      }

      // Resolve category slug -> UUID
      const categoryId = categoryMap[form.subcategory] || categoryMap[form.category];
      if (!categoryId) throw new Error("Please select a valid category");

      // Create listing
      const { error: insertError } = await supabase.from("listings").insert({
        user_id: user.id,
        category_id: categoryId,
        title: form.title,
        description: form.description,
        price: form.price ? parseFloat(form.price) : null,
        price_negotiable: form.priceNegotiable,
        images: imageUrls,
        location_state: form.state,
        location_lga: form.lga,
        location_address: form.address,
      });

      if (insertError) throw new Error(insertError.message);
      router.push("/listings?submitted=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  }

  const steps = ["Details", "Category", "Location", "Images", "Review"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create a New Listing</h1>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                i + 1 <= step
                  ? "bg-brand-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-2 hidden text-sm sm:block ${
                i + 1 <= step ? "font-medium text-gray-900" : "text-gray-400"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="title">Listing Title *</Label>
                <Input
                  id="title"
                  maxLength={200}
                  placeholder="e.g. iPhone 15 Pro Max 256GB"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-400">
                  {form.title.length}/200 characters
                </p>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={6}
                  maxLength={5000}
                  placeholder="Describe your item in detail — condition, features, reason for selling..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-400">
                  {form.description.length}/5000 characters
                </p>
              </div>
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  placeholder="Leave empty for 'Contact for price'"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.priceNegotiable}
                  onChange={(e) => update("priceNegotiable", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600"
                />
                Price is negotiable
              </label>
            </div>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label>Category *</Label>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {CATEGORY_SEED.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => update("category", cat.slug)}
                      className={`rounded-lg border p-3 text-center text-xs font-medium transition-all ${
                        form.category === cat.slug
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {cat.name.en}
                    </button>
                  ))}
                </div>
              </div>
              {form.category && (
                <div>
                  <Label>Subcategory</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CATEGORY_SEED.find((c) => c.slug === form.category)
                      ?.children?.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => update("subcategory", sub.slug)}
                          className={`rounded-lg border p-2.5 text-left text-xs font-medium transition-all ${
                            form.subcategory === sub.slug
                              ? "border-brand-600 bg-brand-50 text-brand-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {sub.name.en}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="state">State *</Label>
                <Select
                  value={form.state}
                  onChange={(e) => {
                    update("state", e.target.value);
                    setSelectedState(e.target.value);
                    update("lga", "");
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
              {form.state && (
                <div>
                  <Label htmlFor="lga">LGA *</Label>
                  <Select
                    value={form.lga}
                    onChange={(e) => update("lga", e.target.value)}
                  >
                    <option value="">Select LGA</option>
                    {NIGERIAN_STATES.find((s) => s.name === form.state)
                      ?.lgAs.map((lga) => (
                        <option key={lga} value={lga}>
                          {lga}
                        </option>
                      ))}
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="address">Street Address / Landmark</Label>
                <Input
                  id="address"
                  placeholder="e.g. Near Ikeja City Mall, GRA Lagos"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <Label>Images (max 10, max 5MB each)</Label>
                <p className="mb-3 text-xs text-gray-400">
                  JPEG, PNG, or WebP. First image becomes the cover.
                </p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400">
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                      <span className="mt-1 text-xs text-gray-400">Add</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  {images.length}/10 images uploaded
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900">Review Your Listing</h3>
              <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500">Title</span>
                  <p className="font-medium text-gray-900">{form.title || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Price</span>
                  <p className="font-medium text-gray-900">
                    {form.price ? `₦${parseInt(form.price).toLocaleString()}` : "Contact for price"}
                    {form.priceNegotiable && " (Negotiable)"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Category</span>
                  <p className="font-medium text-gray-900">
                    {form.category || "—"}
                    {form.subcategory && ` → ${form.subcategory}`}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Location</span>
                  <p className="font-medium text-gray-900">
                    {form.lga && `${form.lga}, `}{form.state || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Images</span>
                  <p className="font-medium text-gray-900">{images.length} images</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Description</span>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
                    {form.description || "—"}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                Your listing will be reviewed by an admin before it goes live. This usually
                takes less than 24 hours.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between border-t border-gray-100 pt-5">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 5 ? (
              <Button
                variant="brand"
                onClick={() => setStep((s) => s + 1)}
                disabled={
                  (step === 1 && (!form.title || !form.description)) ||
                  (step === 2 && !form.category)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                variant="brand"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Submit Listing"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
