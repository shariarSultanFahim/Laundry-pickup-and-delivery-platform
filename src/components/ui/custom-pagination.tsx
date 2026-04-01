import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const getVisiblePages = (current: number, total: number) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
};

interface CustomPaginationProps {
  page: number;
  totalPage: number;
  isLoading?: boolean;
  setPage: (page: number) => void;
}

export function CustomPagination({
  page,
  totalPage,
  isLoading = false,
  setPage,
}: CustomPaginationProps) {
  return (
    <div className="gap-2 flex items-center w-auto bg-red-500 justify-center sm:justify-end">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={page <= 1 || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              onClick={() => {
                if (page > 1 && !isLoading) setPage(Math.max(page - 1, 1));
              }}
            />
          </PaginationItem>

          {getVisiblePages(page, totalPage).map((pageNumber, idx) => (
            <PaginationItem key={idx}>
              {pageNumber === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  className="cursor-pointer"
                  isActive={pageNumber === page}
                  onClick={() => {
                    if (!isLoading) setPage(pageNumber as number);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              className={page >= totalPage || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              onClick={() => {
                if (page < totalPage && !isLoading) setPage(Math.min(page + 1, totalPage));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
