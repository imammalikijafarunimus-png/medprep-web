import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Card Component
 * ==============
 * Container for grouping related content and actions.
 * 
 * Variants:
 * - default: Standard card with border
 * - elevated: Card with shadow elevation
 * - interactive: Clickable card with hover states
 * - outline: Minimal card with just border
 * - ghost: Card with no border/shadow
 */

const cardVariants = cva(
  "text-card-foreground flex flex-col rounded-xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card border shadow-sm",
        elevated: "bg-card border shadow-card hover:shadow-elevated",
        interactive: "bg-card border shadow-sm hover:border-brand/50 hover:shadow-md hover:bg-card/80 cursor-pointer",
        outline: "bg-card border",
        ghost: "bg-card/50",
        feature: "bg-card border shadow-sm ring-1 ring-brand/10",
      },
      padding: {
        none: "",
        sm: "p-4 gap-4",
        default: "p-6 gap-6",
        lg: "p-8 gap-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  asChild?: boolean
}

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ 
  className, 
  as: Component = "h3",
  ...props 
}: React.ComponentProps<"h3"> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" }) {
  return (
    <Component
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-tight tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

// ============================================================
// SPECIALIZED CARD VARIANTS
// ============================================================

/**
 * Stat Card - For displaying metrics/statistics
 */
function StatCard({ 
  title, 
  value, 
  description, 
  icon,
  trend,
  className,
  ...props 
}: {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: { value: number; isPositive: boolean }
} & React.ComponentProps<"div">) {
  return (
    <Card variant="default" className={cn("relative overflow-hidden", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p className={cn(
                "text-xs font-medium flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                <span>{trend.isPositive ? "↑" : "↓"}</span>
                {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-brand/10 text-brand">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Feature Card - For highlighting features
 */
function FeatureCard({
  icon,
  title,
  description,
  className,
  ...props
}: {
  icon?: React.ReactNode
  title: string
  description?: string
} & React.ComponentProps<"div">) {
  return (
    <Card variant="feature" className={cn("text-center", className)} {...props}>
      <CardContent className="p-6">
        {icon && (
          <div className="mx-auto mb-4 p-3 rounded-xl bg-brand/10 text-brand w-fit">
            {icon}
          </div>
        )}
        <CardTitle className="text-base mb-2">{title}</CardTitle>
        {description && (
          <CardDescription className="text-center">{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  StatCard,
  FeatureCard,
  cardVariants,
}