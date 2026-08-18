"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(
  () => import("@/components/listings/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="h-[256px] animate-pulse rounded-xl bg-gray-100" />
    ),
  }
);

export { MapView };
