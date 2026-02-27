"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ForgotPasswordFormData, forgotPasswordSchema } from "../schema/forgotPassword.schema";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const canSubmitOtp = useMemo(
    () => otpDigits.every((digit) => digit.trim().length === 1),
    [otpDigits]
  );

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    try {
      // TODO: Implement forgot password API call
      void data;
      setIsOtpOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOtpChange(value: string, index: number) {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 1);
    const nextOtp = [...otpDigits];
    nextOtp[index] = sanitizedValue;
    setOtpDigits(nextOtp);
    setOtpError("");

    if (sanitizedValue && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleOtpResend() {
    setIsLoading(true);
    try {
      //  TODO: Implement OTP resend API call
      toast.success("OTP has been resent to your email.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOtpSubmit() {
    if (!canSubmitOtp) {
      setOtpError("Please enter the 4-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement OTP verification API call
      router.push("/new-password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="px-4 flex h-screen w-full items-center justify-center">
      <div className="max-w-lg rounded-lg bg-white p-8 shadow-lg w-full">
        {/* Heading */}
        <div className="gap-2 py-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl text-foreground text-center">Forgot password</h1>
          <p className="text-sm text-center">
            Enter your email for the verification proccess,we will send 4 digits code to your email.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Enter Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="text"
                      disabled={isLoading}
                      className="border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Login Button */}
            <Button type="submit" disabled={isLoading} className="py-2 font-semibold h-auto w-full">
              {isLoading ? "Sending..." : "CONTINUE"}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              Verify Reset Password
            </DialogTitle>
            <DialogDescription className="text-sm text-center">
              Enter the code sent to your email to reset your password.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 gap-6 flex flex-col items-center">
            <div className="gap-4 flex items-center justify-center">
              {otpDigits.map((digit, index) => (
                <input
                  key={`otp-${index}`}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpChange(event.target.value, index)}
                  onKeyDown={(event) => handleOtpKeyDown(event, index)}
                  className="h-14 w-14 rounded-md border-border text-xl font-semibold text-foreground border text-center"
                />
              ))}
            </div>

            {otpError ? <p className="text-sm text-destructive">{otpError}</p> : null}

            <Button
              type="button"
              onClick={handleOtpSubmit}
              disabled={isLoading}
              className="py-2 font-semibold h-auto w-full"
            >
              {isLoading ? "Verifying..." : "CONTINUE"}
            </Button>
            <p className="text-sm">
              Resend code in <span className="text-blue-500 font-medium">00 : 56</span>
            </p>
            <p className="text-sm text-muted-foreground">
              If you didn&apos;t receive a code!{" "}
              <button
                type="button"
                onClick={handleOtpResend}
                className="font-semibold text-primary hover:underline"
              >
                Resend
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
