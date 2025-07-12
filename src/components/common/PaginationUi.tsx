import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: number[];
  getCanPreviousPage: boolean;
  getCanNextPage: boolean;
  getPageCount: number;
  nextPage: () => void;
  previousPage: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}
export function PaginationUi({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions,
  getCanPreviousPage,
  getCanNextPage,
  nextPage,
  previousPage,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    const delta = 1; // Reduced for mobile
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t">
      <div className="flex items-center space-x-2 text-sm">
        <p className="text-muted-foreground hidden sm:block">
          Showing {startItem} to {endItem} of {totalItems} entries
        </p>
        <p className="text-muted-foreground sm:hidden">
          {startItem}-{endItem} of {totalItems}
        </p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-16 sm:w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground hidden sm:block">per page</p>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={previousPage}
          disabled={!getCanPreviousPage}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {getVisiblePages()
            .slice(0, 5)
            .map(
              (
                page,
                index // Limit visible pages on mobile
              ) => (
                <Button
                  key={index}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    typeof page === "number" && onPageChange(page - 1)
                  }
                  disabled={page === "..."}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              )
            )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={!getCanNextPage}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
