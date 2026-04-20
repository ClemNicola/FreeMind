import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CursorPaginationProps {
  /** 1-indexed current page. */
  currentPage: number;
  /** Total number of pages already loaded in the client cache. */
  loadedPages: number;
  /** Whether the server has more pages to fetch. */
  hasMore: boolean;
  /** Whether a fetch is currently in flight. */
  isFetching?: boolean;
  /** Navigate to a given (1-indexed) page that is already loaded. */
  onPageChange: (page: number) => void;
  /** Fetch the next page from the server. */
  onFetchMore: () => void;
}

const navButtonClass = cn(
  "font-general font-semibold text-dark_blue rounded-full px-4 h-10",
  "border-0 shadow-none bg-transparent",
  "hover:bg-brown/15 hover:text-dark_blue",
);

const pageLinkBaseClass = cn(
  "font-general font-semibold text-dark_blue rounded-full size-10",
  "hover:bg-brown/15 hover:text-dark_blue",
);

const pageLinkActiveClass = cn(
  "bg-dark_blue text-white border-transparent",
  "hover:bg-dark_blue/85 hover:text-white",
);

const disabledClass = "pointer-events-none opacity-40";

export function CursorPagination({
  currentPage,
  loadedPages,
  hasMore,
  isFetching,
  onPageChange,
  onFetchMore,
}: CursorPaginationProps) {
  if (loadedPages <= 1 && !hasMore) return null;

  const isLastLoaded = currentPage >= loadedPages;
  const canPrev = currentPage > 1;
  const canNext = !isLastLoaded || hasMore;

  const handleClick =
    (action: () => void) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      action();
    };

  const handleNext = () => {
    if (isLastLoaded) {
      if (hasMore && !isFetching) {
        onFetchMore();
        onPageChange(currentPage + 1);
      }
    } else {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent className="w-full justify-between gap-1">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handleClick(
              () => canPrev && onPageChange(currentPage - 1),
            )}
            aria-disabled={!canPrev}
            className={cn(navButtonClass, !canPrev && disabledClass)}
          />
        </PaginationItem>

        <li className="flex items-center gap-1">
          {Array.from({ length: loadedPages }, (_, i) => i + 1).map((page) => {
            const isActive = page === currentPage;
            return (
              <PaginationLink
                key={page}
                href="#"
                isActive={isActive}
                onClick={handleClick(() => onPageChange(page))}
                className={cn(
                  pageLinkBaseClass,
                  isActive && pageLinkActiveClass,
                )}
              >
                {page}
              </PaginationLink>
            );
          })}

          {hasMore && <PaginationEllipsis className="text-dark_blue/60" />}
        </li>

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleClick(handleNext)}
            aria-disabled={!canNext || isFetching}
            className={cn(
              navButtonClass,
              (!canNext || isFetching) && disabledClass,
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
