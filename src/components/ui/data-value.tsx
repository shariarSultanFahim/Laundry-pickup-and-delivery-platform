import React from "react";
import { cn } from "@/lib/utils";

interface DataValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | number | null;
  fallback?: string;
}

/**
 * A reusable component to display data fields in forms or tables.
 * Returns the provided value, or a consistently styled fallback (default "N/A") 
 * if the value is null, undefined, or an empty string.
 */
export function DataValue({ 
  value, 
  fallback = "N/A", 
  className,
  ...props 
}: DataValueProps) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <span 
      className={cn(
        "inline-block",
        !hasValue && "text-muted-foreground italic",
        className
      )}
      {...props}
    >
      {hasValue ? value : fallback}
    </span>
  );
}
