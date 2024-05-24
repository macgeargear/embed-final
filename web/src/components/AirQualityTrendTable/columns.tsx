"use client";

import { cn, getAQITrend } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import TrendPopover from "./TrendPopover";

export const columns: ColumnDef<{ date: string; AQI: number }>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "AQI",
    header: "AQI",
    cell: ({ row }) => {
      const AQI = row.getValue("AQI") as number;
      return <TrendPopover AQI={AQI} />;
    },
  },
];
