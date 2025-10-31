import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FALLBACK_MENU_IMAGE = "/images/placeholder.png";

export function resolveMenuImageSrc(rawValue?: string) {
  const trimmed = (rawValue ?? "").trim();
  if (!trimmed) {
    return FALLBACK_MENU_IMAGE;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const normalized = trimmed
    .replace(/^\.\//, "")
    .replace(/^\/+/, "")
    .replace(/^images\//i, "");

  return `/images/${normalized}`;
}
