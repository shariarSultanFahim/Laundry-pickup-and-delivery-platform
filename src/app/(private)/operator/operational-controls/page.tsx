"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useGetMyStores } from "@/lib/actions/store/get.my-stores";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";

import { Card } from "@/components/ui";
import { Combobox } from "@/ui/combobox";

import OperationalControlsContent from "./components/operational-controls-content";

export default function OperatorOperationalControlsPage() {
  const [userSelectedStoreId, setUserSelectedStoreId] = useState<string>("");

  const { data: operatorMe } = useGetOperatorMe();
  const operatorId = operatorMe?.data?.operatorProfile?.id ?? "";

  const { data: storesResponse, isLoading: isStoresLoading } = useGetMyStores(
    operatorId,
    {
      page: 1,
      limit: 100
    },
    Boolean(operatorId)
  );

  const stores = useMemo(() => storesResponse?.data ?? [], [storesResponse?.data]);

  const storeOptions = useMemo(
    () => stores.map((store) => ({ label: store.name, value: store.id })),
    [stores]
  );

  const selectedStoreId = useMemo(() => {
    if (stores.length === 0) {
      return "";
    }

    const selectedStoreStillExists = stores.some((store) => store.id === userSelectedStoreId);
    if (userSelectedStoreId && selectedStoreStillExists) {
      return userSelectedStoreId;
    }

    return stores[0].id;
  }, [stores, userSelectedStoreId]);

  return (
    <div className="space-y-6">
      <Card className="p-6 gap-2 md:flex-row flex-col items-center justify-between">
        <div className="gap-2 flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold">Operational Controls</h1>
          <p className="text-sm text-muted-foreground">Manage operational settings and controls</p>
        </div>
        {stores.length > 0 ? (
          <div className="min-w-64 sm:w-72 w-full">
            <Combobox
              options={storeOptions}
              value={selectedStoreId}
              onValueChange={setUserSelectedStoreId}
              placeholder={isStoresLoading ? "Loading stores..." : "Select store"}
              searchPlaceholder="Search stores..."
              emptyText="No store found."
              disabled={isStoresLoading}
            />
          </div>
        ) : (
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
        )}
      </Card>

      <OperationalControlsContent />
    </div>
  );
}
