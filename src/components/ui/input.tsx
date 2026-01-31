import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-0 focus:border-[#D32F2F]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
}

export { Input }
