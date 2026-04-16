import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

const getVisiblePages = (current: number, total: number) => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pageSet = new Set<number>();
  pageSet.add(1);
  pageSet.add(2);
  pageSet.add(total);
  pageSet.add(current);
  pageSet.add(Math.min(current + 1, total));

  const sortedPages = Array.from(pageSet)
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const visiblePages: Array<number | "ellipsis"> = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (index > 0 && page - previousPage > 1) {
      visiblePages.push("ellipsis");
    }

    visiblePages.push(page);
  });

  return visiblePages;
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
  setPage
}: CustomPaginationProps) {
  return (
    <div className="gap-2 sm:justify-end flex w-auto items-center justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                page <= 1 || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
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
              className={
                page >= totalPage || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
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
