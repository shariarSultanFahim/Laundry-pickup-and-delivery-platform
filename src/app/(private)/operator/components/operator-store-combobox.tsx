"use client";

import { useMemo } from "react";
import Link from "next/link";

import { useGetMyStores } from "@/lib/actions/store/get.my-stores";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";

import { Button } from "@/ui/button";
import { Combobox } from "@/ui/combobox";

type StoreComboboxMode = "first" | "none";

interface OperatorStoreComboboxProps {
  value?: string;
  onValueChange: (storeId: string) => void;
  mode?: StoreComboboxMode;
  className?: string;
  placeholder?: string;
}

export default function OperatorStoreCombobox({
  value,
  onValueChange,
  mode = "none",
  className,
  placeholder
}: OperatorStoreComboboxProps) {
  const { data: operatorMe } = useGetOperatorMe();
  const operatorId = operatorMe?.data?.operatorProfile?.id ?? "";

  const { data: storesResponse, isLoading } = useGetMyStores(
    operatorId,
    {
      page: 1,
      limit: 100
    },
    Boolean(operatorId)
  );

  const stores = useMemo(() => storesResponse?.data ?? [], [storesResponse?.data]);

  const options = useMemo(
    () => stores.map((store) => ({ value: store.id, label: store.name })),
    [stores]
  );

  const resolvedValue = useMemo(() => {
    if (stores.length === 0) {
      return "";
    }

    const selectedValue = value ?? "";
    const selectedStoreStillExists = stores.some((store) => store.id === selectedValue);

    if (selectedStoreStillExists) {
      return selectedValue;
    }

    if (mode === "first") {
      return stores[0].id;
    }

    return "";
  }, [mode, stores, value]);

  const canClear = mode === "none" && Boolean(resolvedValue);

  if (!isLoading && stores.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        You have no store. Go to{" "}
        <Link
          href="/operator/store-management"
          className="text-primary underline underline-offset-2"
        >
          Store Management
        </Link>{" "}
        page to create a store.
      </p>
    );
  }

  return (
    <div className="gap-2 sm:flex-row flex flex-col items-stretch">
      <div className={className ?? "min-w-64 sm:w-72 w-full"}>
        <Combobox
          options={options}
          value={resolvedValue}
          onValueChange={onValueChange}
          placeholder={isLoading ? "Loading stores..." : (placeholder ?? "Select store")}
          searchPlaceholder="Search stores..."
          emptyText="No store found."
          disabled={isLoading}
        />
      </div>

      {canClear ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => onValueChange("")}
          disabled={isLoading}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
}
