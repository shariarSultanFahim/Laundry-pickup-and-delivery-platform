"use client";

import { useRouter } from "next/navigation";

import { AlertCircle, ArrowLeft, RefreshCw, XCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";

export default function OnboardingFailedPage() {
  const router = useRouter();

  return (
    <div className="from-orange-50 to-red-50 p-4 flex min-h-screen items-center justify-center bg-linear-to-br">
      <Card className="max-w-md border-orange-200 bg-white w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <XCircle className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Onboarding Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-orange-300 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertTitle>Setup Incomplete</AlertTitle>
            <AlertDescription>
              You cancelled the Stripe onboarding process. Your account is not yet set up to receive
              payouts.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              To start receiving payments for your laundry services, you'll need to complete the
              Stripe Connect onboarding. This is a one-time setup that helps us securely manage your
              payments.
            </p>

            <p className="text-sm text-muted-foreground">
              Don't worry, you can try again anytime from your profile settings.
            </p>
          </div>

          <div className="gap-2 flex">
            <Button variant="outline" onClick={() => router.back()} className="gap-2 flex-1">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => router.push("/operator/profile")} className="gap-2 flex-1">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>

          <div className="text-xs text-muted-foreground pt-4 border-t text-center">
            <p>Need help? Contact our support team for assistance with Stripe setup.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
