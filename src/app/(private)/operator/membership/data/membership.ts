import type { MembershipDateRange } from "@/types/membership-breakdown";

export const DATE_RANGE_OPTIONS: Array<{ value: MembershipDateRange; label: string }> = [
  { value: "today", label: "Today" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "month-year", label: "Month + Year" }
];

export const MONTH_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

export const YEAR_OPTIONS: Array<{ value: string; label: string }> = Array.from(
  { length: 5 },
  (_, index) => {
    const year = (new Date().getFullYear() - index).toString();
    return { value: year, label: year };
  }
);
