"use client";

import { Filter, X } from "lucide-react";

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui";

import { ratingOptions, serviceTypeOptions, sortOptions } from "../data/review";
import type { OperatorReviewFilters } from "../schema/review-filters.schema";

interface ReviewFiltersProps {
  filters: OperatorReviewFilters;
  onFiltersChange: (filters: OperatorReviewFilters) => void;
}

export default function ReviewFilters({ filters, onFiltersChange }: ReviewFiltersProps) {
  const handleRatingChange = (value: string) => {
    onFiltersChange({
      ...filters,
      rating: value || undefined
    });
  };

  const handleServiceTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      serviceType: value || undefined
    });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: (value as "newest" | "oldest" | "highest" | "lowest") || "newest"
    });
  };

  const handleReset = () => {
    onFiltersChange({
      rating: undefined,
      serviceType: undefined,
      sortBy: "newest"
    });
  };

  const hasActiveFilters = filters.rating || filters.serviceType;

  return (
    <div className="gap-4 p-4 md:flex-row md:items-center md:justify-between bg-muted rounded-lg flex flex-col border">
      <div className="gap-3 md:flex-row md:items-center flex flex-col items-start">
        <div className="gap-2 flex items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filter by Rating:</span>
        </div>
        <Select value={filters.rating || ""} onValueChange={handleRatingChange}>
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="All">All Ratings</SelectItem> */}
            {ratingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="gap-3 md:flex-row md:items-center flex flex-col items-start">
        <span className="font-medium">Service Type:</span>
        <Select value={filters.serviceType || ""} onValueChange={handleServiceTypeChange}>
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="All">All Services</SelectItem> */}
            {serviceTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="gap-3 md:flex-row md:items-center flex flex-col items-start">
        <span className="font-medium">Sort by:</span>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="Newest First" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <X className="h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
