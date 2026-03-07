"use client";

import * as React from "react";

import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { type DateRange } from "react-day-picker";

import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Field } from "@/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

interface DateRangePickerProps {
  value: {
    fromDate: string;
    toDate: string;
  };
  onChange: (value: { fromDate: string; toDate: string }) => void;
}

function getTodayRange(): DateRange {
  const today = new Date();
  return { from: today, to: today };
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const from = value.fromDate ? parseISO(value.fromDate) : undefined;
    const to = value.toDate ? parseISO(value.toDate) : undefined;

    if (!from && !to) {
      return getTodayRange();
    }

    return {
      from,
      to
    };
  });

  React.useEffect(() => {
    const from = value.fromDate ? parseISO(value.fromDate) : undefined;
    const to = value.toDate ? parseISO(value.toDate) : undefined;

    if (!from && !to) {
      setDate(getTodayRange());
      return;
    }

    setDate({ from, to });
  }, [value.fromDate, value.toDate]);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);

    if (!range?.from) {
      const today = new Date().toISOString().slice(0, 10);
      onChange({ fromDate: today, toDate: today });
      return;
    }

    const toDate = range.to ?? range.from;

    onChange({
      fromDate: range.from.toISOString().slice(0, 10),
      toDate: toDate.toISOString().slice(0, 10)
    });
  };

  const handleSetToday = () => {
    const today = new Date();
    const todayIso = today.toISOString().slice(0, 10);

    setDate({ from: today, to: today });
    onChange({ fromDate: todayIso, toDate: todayIso });
  };

  const from = date?.from;
  const to = date?.to;

  return (
    <Field className="md:w-auto w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="px-2.5 font-normal md:w-[320px] w-full justify-start"
          >
            <CalendarIcon className="h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(from, "LLL dd, y")} - {format(to, "LLL dd, y")}
                </>
              ) : (
                format(from, "LLL dd, y")
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
              Set to Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
