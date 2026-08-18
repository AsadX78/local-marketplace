"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NIGERIAN_STATES } from "@/lib/constants";

interface SearchFiltersProps {
  initialCategory?: string;
}

export function SearchFilters({ initialCategory }: SearchFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const [state, setState] = React.useState(params.get("state") || "");
  const [category, setCategory] = React.useState(initialCategory || params.get("category") || "");
  const [minPrice, setMinPrice] = React.useState(params.get("min") || "");
  const [maxPrice, setMaxPrice] = React.useState(params.get("max") || "");
  const [sort, setSort] = React.useState(params.get("sort") || "newest");
  const [negotiable, setNegotiable] = React.useState(params.get("nego") === "1");

  function applyFilters() {
    const newParams = new URLSearchParams();
    if (params.get("q")) newParams.set("q", params.get("q")!);
    if (state) newParams.set("state", state);
    if (category) newParams.set("category", category);
    if (minPrice) newParams.set("min", minPrice);
    if (maxPrice) newParams.set("max", maxPrice);
    if (sort) newParams.set("sort", sort);
    if (negotiable) newParams.set("nego", "1");
    router.push(`/listings?${newParams.toString()}`);
  }

  function resetFilters() {
    setState("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setNegotiable(false);
    const newParams = new URLSearchParams();
    if (params.get("q")) newParams.set("q", params.get("q")!);
    router.push(`/listings?${newParams.toString()}`);
  }

  return (
    <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5">
      <div>
        <Label className="mb-1.5 block">State</Label>
        <Select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">All States</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s.code} value={s.name}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block">Sort By</Label>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="nearest">Nearest to Me</option>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block">Price Range (₦)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-gray-400">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={negotiable}
          onChange={(e) => setNegotiable(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        Negotiable only
      </label>

      <div className="space-y-2 pt-2">
        <Button variant="brand" className="w-full" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="ghost" className="w-full" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
}
