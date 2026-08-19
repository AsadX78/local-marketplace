"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-24 w-24 text-2xl",
};

export function Avatar({ src, alt, fallback, className, size = "md" }: AvatarProps) {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700",
          sizeMap[size],
          className
        )}
      >
        {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Avatar"}
      className={cn("rounded-full object-cover", sizeMap[size], className)}
      onError={() => setError(true)}
    />
  );
}
