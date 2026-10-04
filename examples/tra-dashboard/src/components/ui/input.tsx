import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const field =
  "h-10 w-full rounded-md border border-border bg-surface px-3 text-text placeholder:text-muted t-fast transition-colors hover:border-border-strong focus-visible:border-primary";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(field, "w-auto pr-8", className)} {...props} />;
}
