"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { useVerifyStripeOnboarding } from "@/lib/actions/operator/verify-stripe-onboarding";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const { data: operatorData, isLoading: isLoadingOperator } = useGetOperatorMe();
  const { mutateAsync: verifyOnboarding, isPending: isVerifying } = useVerifyStripeOnboarding();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "incomplete" | "error"
  >("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const operatorId = operatorData?.data?.operatorProfile?.id;

  useEffect(() => {
    if (!operatorId || isLoadingOperator) {
      return;
    }

    const verifyStatus = async () => {
      try {
        await verifyOnboarding(operatorId);
        setVerificationStatus("success");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to verify onboarding";
        setErrorMessage(message);
        setVerificationStatus("error");
      }
    };

    void verifyStatus();
  }, [operatorId, isLoadingOperator, verifyOnboarding]);

  if (isLoadingOperator || (verificationStatus === "pending" && isVerifying)) {
    return (
      <div className="from-slate-50 to-slate-100 p-4 flex min-h-screen items-center justify-center bg-linear-to-br">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 gap-4 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-muted-foreground text-center">Verifying your Stripe account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="from-green-50 to-emerald-50 p-4 flex min-h-screen items-center justify-center bg-linear-to-br">
        <Card className="max-w-md border-green-200 bg-white w-full">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Onboarding Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-300 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Stripe Account Verified</AlertTitle>
              <AlertDescription>
                Your Stripe Connect account has been successfully verified. You can now receive
                payouts for your services.
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground">
              You can now start managing your laundry services and receiving payments. Your earnings
              will be automatically deposited to your connected bank account.
            </p>

            <Button onClick={() => router.push("/operator")} className="gap-2 w-full" size="lg">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="from-red-50 to-orange-50 p-4 flex min-h-screen items-center justify-center bg-linear-to-br">
        <Card className="max-w-md border-red-200 bg-white w-full">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage || "Failed to verify your Stripe account"}
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground">
              We encountered an issue while verifying your Stripe account. Please try again or
              contact support if the problem persists.
            </p>

            <div className="gap-2 flex">
              <Button
                variant="outline"
                onClick={() => router.push("/operator/profile")}
                className="flex-1"
              >
                Back to Profile
              </Button>
              <Button onClick={() => router.push("/operator")} className="flex-1">
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
