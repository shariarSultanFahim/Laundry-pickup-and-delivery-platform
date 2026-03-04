"use client";

import { useState } from "react";

import { Paperclip, Send, Smile } from "lucide-react";

import type { SupportTicket } from "@/types/ticket-management";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

import { resolveTicket, sendMessage } from "./tickets-api";

interface TicketChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket | null;
}

export default function TicketChatSheet({ open, onOpenChange, ticket }: TicketChatSheetProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!ticket) {
    return null;
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    await sendMessage(ticket.id, message);
    setMessage("");
    setIsSending(false);
  };

  const handleResolve = async () => {
    await resolveTicket(ticket.id);
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg p-0 flex w-full flex-col">
        <SheetHeader className="border-border px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div className="gap-3 flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={ticket.customerAvatar} alt={ticket.customerName} />
                <AvatarFallback>{getInitials(ticket.customerName)}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-base">{ticket.customerName}</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  Ticket #{ticket.ticketNumber}{" "}
                  {ticket.isCustomerOnline && <span className="text-green-600">• Online now</span>}
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 flex-1 overflow-y-auto">
          <div className="space-y-4 py-4">
            {ticket.messages.length === 0 ? (
              <div className="text-muted-foreground text-sm py-8 text-center">No messages yet</div>
            ) : (
              ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === "support" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.senderType === "support"
                        ? "bg-blue-600 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`mt-1 text-xs ${
                        msg.senderType === "support" ? "text-blue-100" : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-border px-6 py-4 space-y-3 border-t">
          <div className="gap-2 flex items-center">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!message.trim() || isSending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="gap-2 flex items-center justify-between">
            <div className="gap-2 text-sm text-muted-foreground flex items-center">
              <Button variant="ghost" size="sm" className="gap-1 h-8">
                <Paperclip className="h-4 w-4" />
                Attach
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 h-8">
                <Smile className="h-4 w-4" />
                Emoji
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResolve}
              className="gap-1 text-green-600 hover:text-green-700"
            >
              ✓ Resolve
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
