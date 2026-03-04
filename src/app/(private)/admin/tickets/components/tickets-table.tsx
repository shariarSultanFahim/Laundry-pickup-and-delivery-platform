"use client";

import { useEffect, useMemo, useState } from "react";

import { Filter, Search, User } from "lucide-react";

import type { SupportTicket, TicketFilters } from "@/types/ticket-management";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

import TicketChatSheet from "./ticket-chat-sheet";
import { assignTicket, fetchTickets } from "./tickets-api";
import TicketsFilterSheet from "./tickets-filter-sheet";

const PAGE_SIZE = 10;

function getStatusBadgeVariant(status: SupportTicket["status"]) {
  return status === "resolved" ? "default" : "secondary";
}

export default function TicketsTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<TicketFilters>({});
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<SupportTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [chatSheetOpen, setChatSheetOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let isMounted = true;

    async function loadTickets() {
      setIsLoading(true);
      const response = await fetchTickets({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        filters
      });

      if (!isMounted) {
        return;
      }

      setRows(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setIsLoading(false);
    }

    void loadTickets();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, page, filters]);

  const paginationNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  const handleAssignment = async (ticketId: string, assignee: string) => {
    await assignTicket(ticketId, assignee);
    setRows((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, assignedTo: assignee } : ticket))
    );
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
                onChange={(event) => setSearch(event.target.value)}
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
        {isLoading ? (
          <div className="h-24 text-muted-foreground flex items-center justify-center">
            Loading tickets...
          </div>
        ) : rows.length === 0 ? (
          <div className="h-24 text-muted-foreground flex items-center justify-center">
            No tickets found.
          </div>
        ) : (
          rows.map((ticket) => (
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
                        {ticket.status === "open" ? "Open" : "Resolved"}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">
                      {ticket.description}
                    </p>

                    <div className="gap-2 text-muted-foreground text-xs flex items-center">
                      <div className="gap-1 flex items-center">
                        <User className="h-3 w-3" />
                        <span>{ticket.customerName}</span>
                      </div>
                      <span>•</span>
                      <span>{ticket.timeAgo}</span>
                    </div>
                  </div>

                  <div className="gap-3 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={ticket.assignedTo || "not-assigned"}
                      onValueChange={(value) => {
                        if (value !== "not-assigned") {
                          handleAssignment(ticket.id, value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Not Assigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-assigned">Not Assigned</SelectItem>
                        <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                        <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                        <SelectItem value="Alex Smith">Alex Smith</SelectItem>
                        <SelectItem value="Emma Wilson">Emma Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {rows.length > 0 && (
          <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
            <p className="text-muted-foreground">
              Showing {rangeStart}-{rangeEnd} of {total} tickets
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
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
          setFilters(appliedFilters);
          setPage(1);
        }}
        onClearFilters={() => {
          setFilters({});
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
