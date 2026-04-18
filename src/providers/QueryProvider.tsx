"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { TicketMessageListener } from "@/lib/actions/tickets/ticket-message-indicators";
import { queryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <TicketMessageListener />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
