import { type Control } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/ui";

import { type SettingsFormData } from "./settings-form.schema";

type BusinessRulesCardProps = {
  control: Control<SettingsFormData>;
};

export default function BusinessRulesCard({ control }: BusinessRulesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Rules Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="gap-4 md:grid-cols-2 grid grid-cols-1">
          <FormField
            control={control}
            name="businessRules.calcellationWindow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Window (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="businessRules.bookingLeadTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Booking Lead Time (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="businessRules.requirePaymentUpFront"
          render={({ field }) => (
            <FormItem className="gap-2 space-y-0 flex flex-row items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Require payment upfront</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="businessRules.allowPartialPayment"
          render={({ field }) => (
            <FormItem className="gap-2 space-y-0 flex flex-row items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Allow partial payments</FormLabel>
            </FormItem>
          )}
        />

      </CardContent>
    </Card>
  );
}
