import Link from "next/link";

import { BadgeCheck } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";

export default function OperatorAdsCheckoutSuccessPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="gap-2 flex items-center">
          <BadgeCheck className="h-5 w-5 text-emerald-600" />
          Payment Successful
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Your ad subscription payment was completed. You can now create and manage promoted ads.
        </p>
        <Button asChild>
          <Link href="/operator/ads">Go to Ads</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
