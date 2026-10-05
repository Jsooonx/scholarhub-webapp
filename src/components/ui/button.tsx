import { cva, type VariantProps } from "class-variance-authority"
import NextLink from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 touch-manipulation items-center justify-center border text-sm font-medium whitespace-nowrap no-underline outline-none select-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-accent/40 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border-brand-dark bg-brand-dark !text-white shadow-2xs hover:bg-brand-dark/90 hover:border-brand-dark/90",
        primary:
          "border-brand-dark bg-brand-dark !text-white shadow-2xs hover:bg-brand-dark/90 hover:border-brand-dark/90",
        secondary:
          "border-brand-border bg-white !text-brand-dark shadow-2xs hover:bg-brand-cream/60 active:border-brand-border",
        outline:
          "border-brand-border bg-white !text-brand-dark shadow-2xs hover:bg-brand-cream/60 active:border-brand-border",
        ghost:
          "border-transparent bg-transparent !text-brand-dark shadow-none hover:bg-brand-cream/60",
        destructive:
          "border-red-200 bg-red-50 !text-red-700 hover:border-red-300 hover:bg-red-600 hover:!text-white",
        danger:
          "border-red-200 bg-red-50 !text-red-700 hover:border-red-300 hover:bg-red-600 hover:!text-white",
        link: "h-auto rounded-none border-transparent bg-transparent !text-brand-accent px-0 shadow-none hover:underline hover:underline-offset-4",
      },
      size: {
        default: "min-h-9 h-9 gap-1.5 rounded-lg px-3.5 text-sm",
        xs: "min-h-6 h-6 gap-1 rounded-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-7.5 h-7.5 gap-1 rounded-md px-2.5 text-xs",
        lg: "min-h-10 h-10 gap-2 rounded-lg px-4 text-sm",
        icon: "size-9 rounded-lg p-0",
        "icon-xs": "size-6 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7.5 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 rounded-lg p-0",
      },
      shape: {
        base: "rounded-lg",
        control: "rounded-lg",
        square: "rounded-lg",
        circle: "rounded-full",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      { size: "icon", shape: "circle", className: "rounded-full" },
      { size: "icon-sm", shape: "circle", className: "rounded-full" },
      { size: "icon-xs", shape: "circle", className: "rounded-full" },
      { size: "icon-lg", shape: "circle", className: "rounded-full" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "base",
    },
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string
    icon?: React.ReactNode
    loading?: boolean
    title?: React.ReactNode
  }

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string
    external?: boolean
    icon?: React.ReactNode
    linksExternal?: boolean
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "default",
    size = "default",
    shape = "base",
    icon,
    loading,
    disabled,
    children,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
})

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  {
    className,
    variant = "secondary",
    size = "default",
    shape = "base",
    external,
    icon,
    linksExternal,
    href,
    children,
    ...props
  },
  ref
) {
  const classes = cn(buttonVariants({ variant, size, shape }), className)
  const isExternal = Boolean(external ?? linksExternal)

  if (typeof href === "string" && href.startsWith("/") && !isExternal) {
    return (
      <NextLink
        {...props}
        href={href}
        ref={ref}
        data-slot="link-button"
        className={classes}
      >
        {icon}
        {children}
      </NextLink>
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      data-slot="link-button"
      className={classes}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {icon}
      {children}
    </a>
  )
})

Button.displayName = "Button"
LinkButton.displayName = "LinkButton"

export { Button, LinkButton, buttonVariants }
export type { ButtonProps, LinkButtonProps }
