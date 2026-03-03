export const paymentMethods = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept credit cards and online payments",
    isActive: true
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    description: "Quick and secure payments for iOS users",
    isActive: false
  },
  {
    id: "google-pay",
    name: "Google Pay",
    description: "Fast checkout for Android users",
    isActive: true
  }
];

export const businessRules = {
  cancellationWindow: 24,
  bookingLeadTime: 2,
  requirePaymentUpfront: true,
  allowPartialPayments: false,
  sendBookingConfirmations: true
};

export const commissionSettings = {
  platformCommission: 15,
  paymentProcessingFee: 2.9,
  fixedTransactionFee: 0.3,
  payoutSchedule: "weekly" as const
};

export const payoutScheduleOptions = ["weekly", "bi-weekly", "monthly"] as const;

export const settingsDefaultValues = {
  paymentMethods,
  businessRules,
  commissionSettings
};
