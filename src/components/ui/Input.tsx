import { cn } from "../../utils/cn"
import type { InputHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text placeholder:text-text-muted transition-colors focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20",
        className
      )}
      {...props}
    />
  )
}
