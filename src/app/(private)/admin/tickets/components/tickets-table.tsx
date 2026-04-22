"use client";

import { useMemo, useState } from "react";

import { Filter, Search, User } from "lucide-react";

import type { SupportTicket, SupportTicketStatus } from "@/types/ticket-management";

import { useGetTickets } from "@/lib/actions/tickets/get-tickets";
import { useTicketUnreadIndicators } from "@/lib/actions/tickets/ticket-message-indicators";
import { useUpdateTicketStatus } from "@/lib/actions/tickets/update-ticket-status";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

import TicketChatSheet from "./ticket-chat-sheet";
import TicketsFilterSheet from "./tickets-filter-sheet";

const PAGE_SIZE = 10;

function getStatusBadgeVariant(status: SupportTicketStatus) {
  const statusMap: Record<SupportTicketStatus, "default" | "secondary" | "destructive"> = {
    OPEN: "secondary",
    IN_PROGRESS: "secondary",
    RESOLVED: "default",
    CLOSED: "default"
  };
  return statusMap[status];
}

function getStatusLabel(status: SupportTicketStatus): string {
  const labelMap: Record<SupportTicketStatus, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed"
  };
  return labelMap[status];
}

export default function TicketsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<SupportTicketStatus | undefined>();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [chatSheetOpen, setChatSheetOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { mutate: updateStatus } = useUpdateTicketStatus();
  const { getUnreadCountForRoom } = useTicketUnreadIndicators();

  const { data, isLoading, isError } = useGetTickets({
    page,
    limit: PAGE_SIZE,
    searchTerm: search || undefined,
    status
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  const paginationNumbers = useMemo(() => {
    return Array.from({ length: meta?.totalPage ?? 1 }, (_, index) => index + 1);
  }, [meta]);

  const rangeStart = meta?.total === 0 ? 0 : ((meta?.page ?? 1) - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min((meta?.page ?? 1) * PAGE_SIZE, meta?.total ?? 0);

  const handleStatusChange = (ticketId: string, newStatus: SupportTicketStatus) => {
    updateStatus({
      ticketId,
      status: newStatus
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <div>
            <h2 className="font-semibold text-lg">Support Tickets</h2>
            <p className="text-muted-foreground text-sm">
              Manage and track customer support requests
            </p>
          </div>

          <div className="gap-2 flex items-center">
            <div className="md:w-72 relative w-full">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              aria-label="More filters"
              onClick={() => setFilterSheetOpen(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isError && (
          <div className="rounded-xl border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive border">
            Failed to load tickets. Please refresh and try again.
          </div>
        )}

        {isLoading ? (
          <div className="h-24 text-muted-foreground flex items-center justify-center">
            Loading tickets...
          </div>
        ) : rows.length === 0 ? (
          <div className="h-24 text-muted-foreground flex items-center justify-center">
            No tickets found.
          </div>
        ) : (
          rows.map((ticket) => {
            const chatRoomId = ticket.chatRooms[0]?.id;
            const unreadMessageCount = getUnreadCountForRoom(chatRoomId);

            return (
              <Card
                key={ticket.id}
                className="hover:bg-muted/50 p-0 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedTicket(ticket);
                  setChatSheetOpen(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="gap-4 flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="gap-2 flex items-center">
                        <span className="font-semibold text-sm">#{ticket.ticketNumber}</span>
                        <Badge variant={getStatusBadgeVariant(ticket.status)} className="text-xs">
                          {getStatusLabel(ticket.status)}
                        </Badge>
                      </div>

                      <h3 className="gap-1 font-semibold text-foreground inline-flex items-center">
                        <span>{ticket.subject}</span>
                        {unreadMessageCount > 0 ? (
                          <Badge
                            variant="destructive"
                            className="h-5 min-w-5 px-1.5 font-semibold justify-center rounded-full text-[10px]"
                            aria-label={`${unreadMessageCount} unread messages`}
                          >
                            {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                          </Badge>
                        ) : null}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-1">
                        {ticket.description}
                      </p>

                      <div className="gap-2 text-muted-foreground text-xs flex items-center">
                        <div className="gap-1 flex items-center">
                          <User className="h-3 w-3" />
                          <span>{ticket.user.name}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="gap-3 flex items-center" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => {
                          handleStatusChange(ticket.id, value as SupportTicketStatus);
                        }}
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}

        {rows.length > 0 && (
          <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
            <p className="text-muted-foreground">
              Showing {rangeStart}-{rangeEnd} of {meta?.total ?? 0} tickets
            </p>

            <div className="gap-2 flex items-center">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              {paginationNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === page ? "default" : "outline"}
                  size="sm"
                  disabled={isLoading}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={page >= (meta?.totalPage ?? 1) || isLoading}
                onClick={() => setPage((prev) => Math.min(prev + 1, meta?.totalPage ?? 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <TicketsFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        onApplyFilters={(appliedFilters) => {
          setStatus(appliedFilters.status);
          setPage(1);
        }}
        onClearFilters={() => {
          setStatus(undefined);
          setPage(1);
        }}
      />

      <TicketChatSheet
        open={chatSheetOpen}
        onOpenChange={setChatSheetOpen}
        ticket={selectedTicket}
      />
    </Card>
  );
}
