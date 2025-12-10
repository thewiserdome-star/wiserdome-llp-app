import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merge Tailwind class names with conditional helpers
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export { cn }

