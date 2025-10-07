"use client";
import { DateUTCDate } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SkeletonWrapper from "@/app/Mycomponents/SkeletonWrapper";
import { GetTransactionHistoryType } from "@/app/api/transaction_history/route";
import { DataTableColumnHeader } from "@/components/datatable/ColumsHeader";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/datatable/Column_toggle";
import { Button } from "@/components/ui/button";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { Download, MoreHorizontal, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import DeleteTransactionDialog from "./DeleteTransactionDialog";

interface Props {
  from: Date;
  to: Date;
}
type TransactionHistoryRow = GetTransactionHistoryType[0];

const columns: ColumnDef<TransactionHistoryRow>[] = [
  //Category
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        {row.original.categoryicon}
        <div className="capitalize">{row.original.category}</div>
      </div>
    ),
  },
  //description
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        <div className="capitalize">{row.original.description}</div>
      </div>
    ),
  },
  //date
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formatterDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return <div className="text-muted-foreground">{formatterDate}</div>;
    },
  },
  //type
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div
        className={cn(
          `capitalize rounded-lg text-center p-2`,
          row.original.type === "income" && "bg-green-400/10 text-green-600",
          row.original.type === "expense" && "bg-red-400/10 text-red-600"
        )}
      >
        {row.original.type}
      </div>
    ),
  },
  //amount
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <p className="text-md bg-gray-400 rounded-lg text-center font-medium">
        {row.original.formattedAmount}
      </p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original} />,
  },
];

const emptyData: any[] = [];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export default function Transaction({ from, to }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setcolumnFilters] = useState<ColumnFiltersState>([]);

  //ExportCSV
  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  //transaction_history query
  const transaction_history = useQuery<GetTransactionHistoryType>({
    queryKey: ["transaction", "history", from, to],
    queryFn: async () => {
      const transaction = await axios.get(
        `/api/transaction_history?from=${DateUTCDate(from)}&to=${DateUTCDate(
          to
        )}`
      );
      return transaction.data;
    },
  });
  console.log(`data: ${transaction_history}`);

  //table
  const table = useReactTable({
    data: transaction_history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // initialState: {
    //     pagination: {
    //         pageSize: 2
    //     }
    // },
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setcolumnFilters,
    getSortedRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // 43322
  });

  //categoriesOptions
  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    transaction_history.data?.forEach((t) => {
      categoriesMap.set(t.category, {
        value: t.category,
        label: `${t.categoryicon} ${t.category}`,
      });
    });
    const uniqueCategories = new Set(categoriesMap.values());
    return Array.from(uniqueCategories);
  }, [transaction_history.data]);

  return (
    <div className="w-full space-y-6 ">
      {/* ฟิลเตอร์ส่วนบน */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 mt-3 px-8">
          {table.getColumn("category") && (
            <DataTableFacetedFilter
              title="Category"
              column={table.getColumn("category")}
              options={categoriesOptions}
            />
          )}

          {table.getColumn("type") && (
            <DataTableFacetedFilter
              title="Type"
              column={table.getColumn("type")}
              options={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
            />
          )}
        </div>

        {/* ปุ่ม Export และ View Options */}
        <div className="flex items-center gap-3 px-8 mt-3">
          <Button
            size="sm"
            variant="outline"
            className="h-8 border border-primary/40 hover:bg-primary hover:text-white transition-all"
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => ({
                category: row.original.category,
                categoryIcon: row.original.categoryicon,
                description: row.original.description,
                type: row.original.type,
                amount: row.original.amount,
                formattedAmount: row.original.formattedAmount,
                date: row.original.date,
              }));
              handleExportCSV(data);
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>

          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* ตาราง */}
      <SkeletonWrapper isLoading={transaction_history.isFetching}>
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gradient-to-r from-primary/10 via-card to-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "hover:bg-muted/50 transition-all",
                      i % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3 text-sm text-muted-foreground"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ปุ่มเปลี่ยนหน้า */}
        <div className="flex items-center justify-end gap-3 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-muted-foreground/30 hover:bg-muted/60 transition-all"
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-muted-foreground/30 hover:bg-muted/60 transition-all"
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  );
}

function RowActions({ transaction }: { transaction: TransactionHistoryRow }) {
  const [showDelete, setshowDelete] = useState(false);
  return (
    <>
      <DeleteTransactionDialog
        open={showDelete}
        setOpen={setshowDelete}
        transactionId={transaction.id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        {/* content */}
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => {
              setshowDelete((prev) => !prev);
            }}
          >
            <TrashIcon className="h-4 w-4 text-muted-foreground" />
            ลบ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
