/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect, ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"; // Example icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx"; // For conditional class names
import {
  ArrowUpDown,
  ChevronDownIcon,
  ChevronUpIcon,
  Columns3Cog,
  LoaderCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PaginationUi } from "../common/PaginationUi";
import { useColumnVisibilityStore } from "@/store/columnVisibilityStore";
import { useRouter, useSearchParams } from "next/navigation";

// Define a generic type for your table data
type TableDataItem = Record<string, any>;

interface DataTableProps<TData extends TableDataItem> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  emptyMessage?: string;
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  // Optional: For handling actions or custom rendering per row
  renderRowActions?: (row: TData) => ReactNode;
  // Optional: For external state management of filters/sorting
  onSortingChange?: (sorting: SortingState) => void;
  onGlobalFilterChange?: (filter: string) => void;
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  // ... other props like enableRowSelection, customToolbar
  topRightComponent?: ReactNode;
  initialColumnVisibility?: VisibilityState; // Optional: for setting default hidden columns
  label: string;
  tableId: string;
  dataNotFoundComponent?: ReactNode;
}

function checkAlign(align: "left" | "center" | "right", type: "th" | "td") {
  if (type === "th") {
    return {
      "justify-start": align === "left",
      "justify-end": align === "right",
      "justify-center": align === "center",
    };
  }
  return {
    "text-left": align === "left",
    "text-right": align === "right",
    "text-center": align === "center",
  };
}

function DataTable<TData extends TableDataItem>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available.",
  enableSorting = true,
  enableGlobalFilter = false,
  enableColumnFilters = false,
  enableColumnVisibility = true,
  enablePagination = true,
  pageSizeOptions = [10, 25, 50, 100],
  initialPageSize = 10,
  renderRowActions,
  onSortingChange,
  onGlobalFilterChange,
  onPaginationChange,
  topRightComponent,
  dataNotFoundComponent,
  initialColumnVisibility,
  label,
  tableId,
}: DataTableProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSize = Number(searchParams.get("size")) || initialPageSize;

  // --- ZUSTAND INTEGRATION START ---
  const { tableColumnVisibility, setColumnVisibility } =
    useColumnVisibilityStore();
  // Get initial visibility from the store, or default to an empty object
  const initialVisibility = tableColumnVisibility[tableId] || {};

  const [columnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>(
      initialColumnVisibility || initialVisibility || {}
    );

  // Update URL when pagination changes
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("size", pagination.pageSize.toString());
    router.push(`?${params.toString()}`);

    // Call the original onPaginationChange if provided
    onPaginationChange?.(pagination);
  };

  useEffect(() => {
    setColumnVisibility(tableId, columnVisibility);
  }, [columnVisibility, tableId, setColumnVisibility]);

  // Memoize columns to prevent unnecessary re-renders of the table instance
  const memoizedColumns = useMemo(() => {
    return columns.concat(
      renderRowActions
        ? {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => renderRowActions(row.original),
            enableSorting: false,
            enableColumnFilter: false,
            enableHiding: false,
          }
        : []
    ) as ColumnDef<TData>[];
  }, [columns, renderRowActions]);

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: initialPage - 1, // Convert 1-based to 0-based
        pageSize: initialSize,
      },
    },
    onSortingChange: enableSorting
      ? (updater) => {
          setSorting(updater);
          onSortingChange?.(
            updater instanceof Function ? updater(sorting) : updater
          );
        }
      : undefined,
    onGlobalFilterChange: enableGlobalFilter
      ? (updater) => {
          setGlobalFilter(updater);
          onGlobalFilterChange?.(
            updater instanceof Function ? updater(globalFilter) : updater
          );
        }
      : undefined,
    onColumnFiltersChange: enableColumnFilters ? setColumnFilters : undefined,
    onColumnVisibilityChange: enableColumnVisibility
      ? setInternalColumnVisibility
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      enableGlobalFilter || enableColumnFilters
        ? getFilteredRowModel()
        : undefined,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
  });

  useEffect(() => {
    onPaginationChange?.(table.getState().pagination);
  }, [table, onPaginationChange]);

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageCount,
    nextPage,
    previousPage,
    setPageSize,
    setPageIndex,
    getState,
    getAllColumns,
  } = table;

  const { pagination } = getState();

  return (
    <div className="rounded-lg shadow overflow-hidden border border-gray-200">
      {(enableGlobalFilter || enableColumnFilters) && (
        <div className="p-4 bg-white border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          {enableGlobalFilter && (
            <div>
              <Input
                type="text"
                placeholder={`Search all ${label.toLowerCase()} ...`}
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
          <div className="flex gap-2">
            {/* You could add UI for column filters here, perhaps as dropdowns in headers */}
            {enableColumnVisibility && (
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Columns3Cog />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Show Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="">
                      {getAllColumns()
                        .filter((column) => column.getCanHide()) // Only show hideable columns
                        .map((column) => (
                          <div
                            key={column.id}
                            className="flex items-center p-1"
                          >
                            <input
                              {...{
                                type: "checkbox",
                                checked: column.getIsVisible(),
                                onChange: column.getToggleVisibilityHandler(),
                              }}
                              id={`toggle-column-${column.id}`}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`toggle-column-${column.id}`}
                              className="ml-2 text-sm text-gray-700 capitalize"
                            >
                              {typeof column.columnDef.header === "string"
                                ? column.columnDef.header
                                : column.id}{" "}
                              {/* Fallback for complex headers */}
                            </label>
                          </div>
                        ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {topRightComponent ? topRightComponent : null}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(
                      "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider",
                      {
                        "cursor-pointer select-none":
                          header.column.getCanSort(),
                      }
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={clsx(
                          "flex items-center gap-1",
                          checkAlign(
                            header.column.columnDef.meta?.style.textAlign ||
                              "left",
                            "th"
                          )
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {enableSorting && header.column.getCanSort() && (
                          <span className="ml-1">
                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            )}
                            {!header.column.getIsSorted() && (
                              <ArrowUpDown className="h-4 w-4 text-gray-300" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                  className="py-8 text-center text-gray-500"
                >
                  <LoaderCircle
                    size={30}
                    className=" animate-spin mx-auto text-gray-300"
                  />
                </td>
              </tr>
            ) : getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                  className="py-8 text-center text-gray-500"
                >
                  {dataNotFoundComponent || emptyMessage}
                </td>
              </tr>
            ) : (
              getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={clsx(
                        "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                        checkAlign(
                          cell.column.columnDef.meta?.style.textAlign || "left",
                          "td"
                        )
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <PaginationUi
          currentPage={Number(pagination.pageIndex + 1)}
          totalPages={getPageCount()}
          pageSize={pagination.pageSize}
          totalItems={data?.length}
          onPageChange={(page) => {
            setPageIndex(page - 1);
            handlePaginationChange({
              pageIndex: page,
              pageSize: getState().pagination.pageSize,
            });
          }}
          onPageSizeChange={(size) => {
            setPageSize(size);
            handlePaginationChange({
              pageIndex: 0, // Reset to first page when changing size
              pageSize: size,
            });
          }}
          pageSizeOptions={pageSizeOptions}
          nextPage={nextPage}
          previousPage={previousPage}
          getCanNextPage={getCanNextPage()}
          getCanPreviousPage={getCanPreviousPage()}
          getPageCount={getPageCount()}
        />
      )}
    </div>
  );
}

export default DataTable;
