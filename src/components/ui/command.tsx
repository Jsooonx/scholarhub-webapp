"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl bg-brand-bg text-brand-dark",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a scholarship, destination, or action...",
  children,
  className,
  showCloseButton = false,
  filter,
  shouldFilter,
  open,
  onOpenChange,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  filter?: (value: string, search: string, keywords?: string[]) => number
  shouldFilter?: boolean
  children: React.ReactNode
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} data-slot="command-dialog" {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          data-slot="command-dialog-backdrop"
          className="command-palette-backdrop fixed inset-0 isolate z-50 cursor-pointer"
        />
        <DialogPrimitive.Popup
          data-slot="command-dialog-popup"
          className={cn(
            "command-palette-popup fixed top-[10%] sm:top-[14%] left-1/2 z-50 w-full max-w-[calc(100%-1.5rem)] sm:max-w-xl overflow-hidden rounded-2xl border border-brand-border/80 bg-brand-bg/95 backdrop-blur-xl p-0 shadow-2xl shadow-brand-dark/20 outline-none ring-1 ring-black/5",
            className
          )}
        >
          <div className="sr-only">
            <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description>{description}</DialogPrimitive.Description>
          </div>
          <Command className="bg-transparent" filter={filter} shouldFilter={shouldFilter}>
            {children}
          </Command>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex items-center border-b border-brand-border/60 px-4 py-3.5">
      <SearchIcon className="mr-3 size-4 shrink-0 text-brand-muted" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "w-full bg-transparent text-sm text-brand-dark placeholder:text-brand-muted/70 outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[360px] overflow-x-hidden overflow-y-auto p-2 outline-none navbar-dropdown-scroll",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-8 text-center text-xs text-brand-muted", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-brand-dark [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-brand-muted",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px bg-brand-border/60", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-brand-dark outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-[#ECE8E0] data-[selected=true]:text-brand-dark aria-selected:bg-[#ECE8E0] aria-selected:text-brand-dark transition-all duration-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-[10px] font-mono tracking-wider text-brand-muted group-data-[selected=true]/command-item:text-brand-dark group-aria-selected/command-item:text-brand-dark",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
