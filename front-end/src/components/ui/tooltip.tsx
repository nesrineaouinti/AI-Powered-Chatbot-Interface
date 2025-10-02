"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// ----------------------------------------------------------------
// 1. TooltipProvider
// ----------------------------------------------------------------

/**
 * Ensures that the Tooltip components work correctly. Must wrap the application 
 * or the section where tooltips are used.
 * @docs: https://www.radix-ui.com/primitives/docs/components/tooltip#tooltip-provider
 */
const TooltipProvider = TooltipPrimitive.Provider

// ----------------------------------------------------------------
// 2. Tooltip (Root)
// ----------------------------------------------------------------

/**
 * The root component for the tooltip.
 * @docs: https://www.radix-ui.com/primitives/docs/components/tooltip#root
 */
const Tooltip = TooltipPrimitive.Root

// ----------------------------------------------------------------
// 3. TooltipTrigger
// ----------------------------------------------------------------

/**
 * The element that triggers the tooltip (e.g., when hovered over).
 * Use `asChild` to apply the trigger behavior to its single child element.
 * @docs: https://www.radix-ui.com/primitives/docs/components/tooltip#tooltip-trigger
 */
const TooltipTrigger = TooltipPrimitive.Trigger

// ----------------------------------------------------------------
// 4. TooltipContent
// ----------------------------------------------------------------

interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {}

/**
 * The actual content/popup of the tooltip.
 * Applies standard shadcn/ui styling for appearance and animation.
 * @docs: https://www.radix-ui.com/primitives/docs/components/tooltip#tooltip-content
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs text-background",
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "bg-foreground shadow-md", // Custom styling: bg-foreground and text-background are standard shadcn/ui colors
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// ----------------------------------------------------------------
// 5. Exports
// ----------------------------------------------------------------

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
}