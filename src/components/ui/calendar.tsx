"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-4 sm:flex-row sm:gap-4",
        month: "space-y-4",
        month_caption: "relative flex items-center justify-center pt-1",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "left-1 h-7 w-7 p-0 absolute bg-transparent opacity-80 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "right-1 h-7 w-7 p-0 absolute bg-transparent opacity-80 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground w-8 rounded-md font-normal text-[0.8rem]",
        weeks: "mt-2",
        week: "mt-2 flex w-full",
        day: cn(
          "p-0 text-sm relative text-center focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has(.range-end)]:rounded-r-md [&:has(.range-start)]:rounded-l-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        range_start: "range-start",
        range_end: "range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames
      }}
      components={{
        Chevron: ({ orientation, className }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("h-4 w-4", className)} />;
          }

          return <ChevronRight className={cn("h-4 w-4", className)} />;
        }
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
