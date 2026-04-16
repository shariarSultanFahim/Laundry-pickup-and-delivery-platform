"use client";

import { useState } from "react";

import { Card } from "@/components/ui";

import OperatorStoreCombobox from "../components/operator-store-combobox";
import ReviewsContent from "./components/reviews-content";

export default function OperatorReviewsPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  return (
    <div className="space-y-6">
      <Card className="p-6 gap-2 md:flex-row flex-col items-center justify-between">
        <div className="gap-2 flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold">Reviews & Ratings</h1>
          <p className="text-sm text-muted-foreground">
            Monitor customer feedback and service qualit
          </p>
        </div>
        <OperatorStoreCombobox
          value={selectedStoreId}
          onValueChange={setSelectedStoreId}
          mode="none"
          placeholder="All stores"
        />
      </Card>

      <ReviewsContent storeId={selectedStoreId || undefined} />
    </div>
  );
}
