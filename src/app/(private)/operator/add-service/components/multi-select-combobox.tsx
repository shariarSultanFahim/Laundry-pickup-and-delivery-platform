"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface MultiSelectComboboxProps {
  options: ComboboxOption[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

export function MultiSelectCombobox({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyText = "No option found."
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onValueChange?.(value.filter((v) => v !== optionValue));
    } else {
      onValueChange?.([...value, optionValue]);
    }
  };

  const handleRemove = (removeValue: string) => {
    onValueChange?.(value.filter((v) => v !== removeValue));
  };

  const selectedLabels = value
    .map((v) => options.find((opt) => opt.value === v)?.label)
    .filter(Boolean);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10"
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {label}
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      const idx = value.findIndex(
                        (v) => options.find((opt) => opt.value === v)?.label === label
                      );
                      if (idx >= 0) handleRemove(value[idx]);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="p-2 space-y-2">
          <div className="flex items-center border rounded-md px-2">
            <Search className="h-4 w-4 opacity-50" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filtered.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-4">
                {emptyText}
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-accent flex items-center gap-2",
                    value.includes(option.value) && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
