"use client";

import * as React from "react";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Field } from "@/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onApply: (from: Date, to?: Date) => void;
  onClear: () => void;
}

export default function DateRangePicker({ from, to, onApply, onClear }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (!from && !to) {
      return undefined;
    }

    return {
      from,
      to
    };
  });

  React.useEffect(() => {
    if (!from && !to) {
      setDate(undefined);
      return;
    }

    setDate({ from, to });
  }, [from, to]);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);

    if (!range?.from) {
      onClear();
      return;
    }

    const toDate = range.to ?? range.from;
    onApply(range.from, toDate);
  };

  const handleSetToday = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setDate({ from: firstDayOfMonth, to: lastDayOfMonth });
    onApply(firstDayOfMonth, lastDayOfMonth);
  };

  const fromDate = date?.from;
  const toDate = date?.to;

  return (
    <Field className="md:w-auto w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="px-2.5 font-normal md:w-[320px] w-full justify-start"
          >
            <CalendarIcon className="h-4 w-4" />
            {fromDate ? (
              toDate ? (
                <>
                  {format(fromDate, "LLL dd, y")} - {format(toDate, "LLL dd, y")}
                </>
              ) : (
                format(fromDate, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
          <div className="p-3 border-t">
            <Button variant="outline" size="sm" onClick={handleSetToday} className="w-full">
              Set this Month
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
