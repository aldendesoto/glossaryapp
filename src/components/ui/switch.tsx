import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  leftLabel: string
  rightLabel: string
  className?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, leftLabel, rightLabel, className }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "inline-flex items-center gap-1 px-0.5 py-0.5 rounded-full border bg-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <span
          className={cn(
            "px-2 py-0.5 text-xs font-semibold transition-colors rounded-full",
            !checked ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {leftLabel}
        </span>
        <span
          className={cn(
            "px-2 py-0.5 text-xs font-semibold transition-colors rounded-full",
            checked ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {rightLabel}
        </span>
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
