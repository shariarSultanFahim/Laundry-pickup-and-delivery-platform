"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";

import type { ChatMessage, SupportTicket } from "@/types/ticket-management";

import { useInfiniteChatMessages } from "@/lib/actions/tickets/use-chat-messages";
import { useGetMe } from "@/lib/actions/user/use-get-me";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { useSocket } from "@/providers";

interface TicketChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket | null;
}

interface OptimisticMessage extends ChatMessage {
  isPending?: boolean;
}

export default function TicketChatSheet({ open, onOpenChange, ticket }: TicketChatSheetProps) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const topObserverRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolledOnOpenRef = useRef(false);
  const { data: user } = useGetMe();
  const adminId = user?.data?.id;
  const chatRoom = ticket?.chatRooms[0];

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteChatMessages(chatRoom?.id, open);

  // API returns newest-first; normalize to oldest-first for bottom-latest chat UX.
  const allMessages =
    messagesData?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.data.slice().reverse()) ?? [];
  const displayMessages = [...allMessages, ...optimisticMessages];

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    if (!open) {
      hasAutoScrolledOnOpenRef.current = false;
      return;
    }

    if (hasAutoScrolledOnOpenRef.current || isLoading || allMessages.length === 0) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToBottom();
      hasAutoScrolledOnOpenRef.current = true;
    });
  }, [open, isLoading, allMessages.length, scrollToBottom]);

  // Handle infinite scroll (load older messages when reaching top)
  useEffect(() => {
    if (!topObserverRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(topObserverRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Socket event handling
  useEffect(() => {
    if (!socket || !chatRoom || !open) return;

    // Join the room
    socket.emit("join-room", chatRoom.id);

    // Listen for new incoming messages
    const handleNewMessage = () => {
      // Refetch messages to keep in sync with server
      void queryClient.invalidateQueries({ queryKey: ["chat-messages", chatRoom.id] }).then(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, chatRoom, open, queryClient, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || isSending || !socket || !chatRoom) return;

    setIsSending(true);
    const messageText = message;
    setMessage("");

    // Create optimistic message
    const optimisticMsg: OptimisticMessage = {
      id: `temp-${Date.now()}`,
      roomId: chatRoom.id,
      senderUserId: adminId,
      senderOperatorId: null,
      content: messageText,
      isDeleted: false,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      senderUser: user?.data
        ? {
            id: user.data.id,
            name: user.data.name,
            avatar: user.data.avatar ?? null
          }
        : null,
      senderOperator: null,
      isPending: true
    };

    // Show optimistic message immediately (append to end)
    setOptimisticMessages((prev) => [...prev, optimisticMsg]);
    requestAnimationFrame(() => {
      scrollToBottom();
    });

    // Send to backend
    socket.emit("send-message", {
      roomId: chatRoom.id,
      senderId: adminId,
      content: messageText
    });

    // Simulate waiting for response and refetch
    setTimeout(() => {
      setIsSending(false);
      // Refetch to get the confirmed message from server
      void queryClient.invalidateQueries({ queryKey: ["chat-messages", chatRoom.id] }).then(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
      // Remove optimistic message after refetch
      setOptimisticMessages((prev) => prev.filter((msg) => msg.id !== optimisticMsg.id));
    }, 10);
  }, [message, isSending, socket, chatRoom, queryClient, adminId, user, scrollToBottom]);

  if (!ticket || !chatRoom) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getSenderInfo = (msg: ChatMessage) => {
    const isAdminMessage = msg.senderUserId === adminId;
    return { name: isAdminMessage ? "You" : ticket.user.name, isOperator: isAdminMessage };
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg p-0 flex w-full flex-col">
        <SheetHeader className="border-border px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div className="gap-3 flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={ticket.user.avatar ?? undefined} alt={ticket.user.name} />
                <AvatarFallback>{getInitials(ticket.user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-base">{ticket.user.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">Ticket #{ticket.ticketNumber}</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div
          ref={messagesContainerRef}
          className="px-6 flex flex-1 flex-col overflow-x-hidden overflow-y-auto"
        >
          <div className="space-y-4 py-4">
            {displayMessages.length === 0 && !isLoading ? (
              <div className="text-muted-foreground text-sm py-8 text-center">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <>
                <div ref={topObserverRef} className="h-1" />
                {displayMessages.map((msg) => {
                  const senderInfo = getSenderInfo(msg);
                  const isOperatorMessage = senderInfo.isOperator;
                  const isPending = (msg as OptimisticMessage).isPending;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOperatorMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          isOperatorMessage ? "bg-blue-600 text-white" : "bg-muted text-foreground"
                        } ${isPending ? "opacity-70" : ""}`}
                      >
                        <p className="text-sm">
                          {msg.content}
                          {isPending && <span className="ml-1">...</span>}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            isOperatorMessage ? "text-blue-100" : "text-muted-foreground"
                          }`}
                        >
                          {isPending
                            ? "Sending"
                            : new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isFetchingNextPage && (
                  <div className="text-muted-foreground text-xs py-2 text-center">
                    Loading older messages...
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="border-border px-6 py-4 border-t">
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
              disabled={isSending}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending || !socket}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
