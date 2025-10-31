"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { FALLBACK_MENU_IMAGE, resolveMenuImageSrc } from "../lib/utils";

interface LoadingImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function LoadingImage({
  src,
  alt,
  width,
  height,
  className,
}: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = resolveMenuImageSrc(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative">
      {isLoading && <Skeleton className={`absolute inset-0 ${className}`} />}
      <Image
        src={hasError ? FALLBACK_MENU_IMAGE : normalizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
