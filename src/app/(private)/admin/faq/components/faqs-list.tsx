"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetFAQs } from "@/lib/actions/faq";
import { FAQCard } from "./faq-card";

interface FAQsListProps {
  refreshTrigger?: number;
}

export function FAQsList({ refreshTrigger }: FAQsListProps) {
  const { data, isLoading, isError, error, refetch } = useGetFAQs({
    limit: 100,
    page: 1
  });

  // Refetch when the trigger changes
  if (refreshTrigger) {
    refetch();
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load FAQs: {error instanceof Error ? error.message : "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  const faqs = data?.data || [];

  if (faqs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-muted-foreground">
            No FAQs found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          Create your first FAQ to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {faqs
        .filter((faq) => faq.isActive)
        .map((faq) => (
          <FAQCard
            key={faq.id}
            faq={faq}
            onDeleteSuccess={() => refetch()}
          />
        ))}
    </div>
  );
}
