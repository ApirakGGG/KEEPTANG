"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { differenceInDays } from "date-fns/differenceInDays";
import React from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Max_Date_Range_Days } from "@/lib/constants";
import { startOfMonth } from "date-fns";
import Transaction from "./_components/Transaction";

export default function TransactionPage() {
  const [Daterange, setDaterange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className="border-b bg-card px-8 ">
        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Transaction History</p>
          </div>
          <DateRangePicker
            initialDateFrom={Daterange.from}
            initialDateTo={Daterange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              //update date range only when set date
              if (!from || !to) return;
              if (differenceInDays(to, from) > Max_Date_Range_Days) {
                toast.error(
                  `เลือกระยะเวลามากเกินไป ไม่เกิน ${Max_Date_Range_Days} วัน`
                );
                return;
              }
              //set date range
              setDaterange({ from, to });
            }}
          />
        </div>
      </div>
      <Transaction from={Daterange.from} to={Daterange.to} />
    </>
  );
}
