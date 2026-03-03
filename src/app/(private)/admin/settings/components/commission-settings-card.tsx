import { type Control } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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

import { payoutScheduleOptions } from "../data/settings";
import { type SettingsFormData } from "./settings-form.schema";

type CommissionSettingsCardProps = {
  control: Control<SettingsFormData>;
};

export default function CommissionSettingsCard({ control }: CommissionSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Settings</CardTitle>
      </CardHeader>
      <CardContent className="gap-4 md:grid-cols-2 grid grid-cols-1">
        <FormField
          control={control}
          name="commissionSettings.platformCommission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform Commission (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
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
          name="commissionSettings.paymentProcessingFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Processing Fee (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
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
          name="commissionSettings.fixedTransactionFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fixed Transaction Fee ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
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
          name="commissionSettings.payoutSchedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout Schedule</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payout schedule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {payoutScheduleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
