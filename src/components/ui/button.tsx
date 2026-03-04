import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button Component
 * ================
 * Primary interactive element for user actions.
 * 
 * Variants:
 * - default: Primary actions (brand color)
 * - brand: Brand-colored button for CTAs
 * - secondary: Secondary actions
 * - destructive: Destructive/danger actions
 * - outline: Outlined button for less prominent actions
 * - ghost: Minimal button for subtle actions
 * - link: Text link style
 * - success: Success/positive actions
 * - warning: Warning/caution actions
 * 
 * Sizes:
 * - sm: Compact button (h-8)
 * - default: Standard button (h-10)
 * - lg: Large button (h-12)
 * - icon: Square icon button (size-10)
 * - iconSm: Small icon button (size-8)
 */
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary brand button
        default:
          "bg-brand text-brand-foreground shadow-sm hover:bg-brand-dark",
        
        // Explicit brand variant
        brand:
          "bg-brand text-brand-foreground shadow-sm hover:bg-brand-dark",
        
        // Secondary actions
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        
        // Destructive/danger actions
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/50",
        
        // Outlined button
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-brand/50",
        
        // Ghost/minimal button
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        
        // Link style
        link: 
          "text-brand underline-offset-4 hover:underline",
        
        // Success/positive actions
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/90",
        
        // Warning/caution actions
        warning:
          "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs gap-1.5",
        default: "h-10 px-4 py-2 gap-2",
        lg: "h-12 rounded-lg px-6 text-base gap-2.5",
        icon: "size-10 rounded-lg",
        iconSm: "size-8 rounded-md",
        iconLg: "size-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }