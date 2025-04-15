import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(number: number | undefined): string {
  if (number === undefined) return "0";
  return `${number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}€`;
}
