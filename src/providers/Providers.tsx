"use client";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui";
import { CounterProvider, QueryProvider, SocketProvider, ThemeProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <SocketProvider>
          <CounterProvider>
            <QueryProvider>{children}</QueryProvider>
          </CounterProvider>
        </SocketProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}
