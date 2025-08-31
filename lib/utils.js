import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge CSS classes using clsx and tailwind-merge
 * Combines multiple class names and resolves Tailwind CSS conflicts
 * @param {...(string|Object|Array)} inputs - Class names, objects, or arrays to merge
 * @returns {string} Merged and deduplicated class string
 * @example
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive })
 * // Returns: "px-4 py-2 bg-blue-500 text-white"
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
