import Image from "next/image";

import { useWatch, type Control } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/ui";

import { type SettingsFormData } from "./settings-form.schema";

type PaymentMethodsCardProps = {
  control: Control<SettingsFormData>;
};

export default function PaymentMethodsCard({ control }: PaymentMethodsCardProps) {
  const paymentMethods = useWatch({ control, name: "paymentMethods" });

  if (!paymentMethods) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method, index) => (
          <div
            key={method.id}
            className="rounded-lg border-border px-4 py-3 flex items-center justify-between border"
          >
            <div className="gap-3 flex items-center">
              <Image
                src={
                  method.name === "Stripe"
                    ? "/stripe.svg"
                    : method.name === "Google Pay"
                      ? "/gpay.svg"
                      : "/applepay.svg"
                }
                alt={`${method.name} logo`}
                width={40}
                height={40}
                className="rounded-md"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{method.name}</p>
                <CardDescription>{method.description}</CardDescription>
              </div>
            </div>

            <FormField
              control={control}
              name={`paymentMethods.${index}.isActive`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">{method.name}</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
