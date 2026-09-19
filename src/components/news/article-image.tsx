"use client";

import { ImageOffIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";

type ArticleImageProps = {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** next/image with a graceful placeholder when a publisher's image 404s or blocks hotlinking. */
export function ArticleImage({ src, alt, sizes, priority = false, className }: ArticleImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn("flex items-center justify-center bg-surface-muted text-muted", className)}
      >
        <ImageOffIcon className="size-10" aria-hidden="true" />
        <span className="sr-only">{src ? "Image unavailable" : "No image available"}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
