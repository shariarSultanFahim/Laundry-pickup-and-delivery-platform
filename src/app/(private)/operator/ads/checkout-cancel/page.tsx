import Link from "next/link";

import { AlertTriangle } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";

export default function OperatorAdsCheckoutCancelPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="gap-2 flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Payment Canceled
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You canceled the checkout process. You can return to Ads and try again anytime.
        </p>
        <Button variant="outline" asChild>
          <Link href="/operator/ads">Back to Ads</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
