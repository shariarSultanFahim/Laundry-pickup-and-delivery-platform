"use client";

import { useEffect } from "react";

import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useSetupStripeConnect } from "@/lib/actions/operator/setup-stripe-connect";
import { useVerifyStripeOnboarding } from "@/lib/actions/operator/verify-stripe-onboarding";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";

export default function StripeConnectSection() {
  const { data: operatorData, isLoading: isLoadingOperator } = useGetOperatorMe();
  const { mutateAsync: setupStripeConnect, isPending: isSettingUp } = useSetupStripeConnect();
  const { mutateAsync: verifyOnboarding } = useVerifyStripeOnboarding();

  const operatorProfile = operatorData?.data?.operatorProfile;
  const operatorId = operatorProfile?.id;
  const stripeConnected = operatorProfile?.stripeAccountId;
  const onboardingComplete = operatorProfile?.stripeAccountStatus;

  // Auto-verify on page load if user just returned from Stripe
  useEffect(() => {
    if (!operatorId || stripeConnected || onboardingComplete) {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const isReturningFromStripe = searchParams.has("redirect_to");

    if (isReturningFromStripe) {
      void verifyOnboarding(operatorId)
        .then(() => {
          toast.success("Stripe account verified successfully!", {
            position: "top-center"
          });
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((error) => {
          toast.error(error instanceof Error ? error.message : "Failed to verify Stripe account", {
            position: "top-center"
          });
        });
    }
  }, [operatorId, stripeConnected, onboardingComplete, verifyOnboarding]);

  async function handleConnectStripe() {
    if (!operatorId) {
      toast.error("Unable to get operator ID", { position: "top-center" });
      return;
    }

    try {
      const response = await setupStripeConnect(operatorId);
      const onboardingLink = response.data.onboardingLink;

      if (onboardingLink) {
        window.location.href = onboardingLink;
      } else {
        toast.error("Failed to get Stripe onboarding link", { position: "top-center" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to setup Stripe Connect", {
        position: "top-center"
      });
    }
  }

  // async function handleVerifyOnboarding() {
  //   if (!operatorId) {
  //     toast.error("Unable to get operator ID", { position: "top-center" });
  //     return;
  //   }

  //   try {
  //     await verifyOnboarding(operatorId);
  //     toast.success("Stripe account verified successfully!", {
  //       position: "top-center"
  //     });
  //   } catch (error) {
  //     toast.error(error instanceof Error ? error.message : "Failed to verify Stripe account", {
  //       position: "top-center"
  //     });
  //   }
  // }

  if (isLoadingOperator) {
    return (
      <Card>
        <CardContent className="h-40 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Stripe already connected and complete
  if (onboardingComplete === "ACTIVE" && stripeConnected) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="gap-2 flex items-center">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Stripe Connect</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-300 bg-white">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Stripe Account Connected</AlertTitle>
            <AlertDescription>
              Your Stripe account is successfully connected and active. You can now receive payouts.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Stripe Account ID:</strong> {stripeConnected.slice(0, 20)}...
            </p>
            <Button
              onClick={handleConnectStripe}
              disabled={isSettingUp}
              className="gap-2 sm:w-auto w-full"
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting Up...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Update Stripe Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Stripe onboarding in progress
  // if (onboardingComplete === "ONBOARDING") {
  //   return (
  //     <Card className="border-orange-200 bg-orange-50">
  //       <CardHeader>
  //         <div className="gap-2 flex items-center">
  //           <CreditCard className="h-5 w-5" />
  //           <CardTitle>Stripe Connect - Onboarding In Progress</CardTitle>
  //         </div>
  //       </CardHeader>
  //       <CardContent className="space-y-4">
  //         <Alert className="border-orange-300 bg-white">
  //           <AlertCircle className="h-4 w-4 text-orange-600" />
  //           <AlertTitle>Complete Your Stripe Setup</AlertTitle>
  //           <AlertDescription>
  //             Your Stripe onboarding is not yet complete. Please complete the onboarding process to
  //             start receiving payouts.
  //           </AlertDescription>
  //         </Alert>

  //         <div className="gap-3 flex">
  //           <Button onClick={handleVerifyOnboarding} disabled={isVerifying} className="gap-2">
  //             {isVerifying ? (
  //               <>
  //                 <Loader2 className="h-4 w-4 animate-spin" />
  //                 Checking Status...
  //               </>
  //             ) : (
  //               "Check Onboarding Status"
  //             )}
  //           </Button>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // No Stripe account - need to setup
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="gap-2 flex items-center">
          <CreditCard className="h-5 w-5" />
          <CardTitle>Connect Stripe Account</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-300 bg-white">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>Stripe Onboarding Required</AlertTitle>
          <AlertDescription>
            Connect your Stripe account to start receiving payouts. We use Stripe Connect to
            securely manage your payments.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Click the button below to begin the secure Stripe onboarding process. You&apos;ll be
            redirected to Stripe to complete your setup.
          </p>
        </div>

        <Button
          onClick={handleConnectStripe}
          disabled={isSettingUp}
          className="gap-2 sm:w-auto w-full"
        >
          {isSettingUp ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Setting Up...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Connect Stripe Account
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
