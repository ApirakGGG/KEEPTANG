"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Max_Date_Range_Days } from "@/lib/constants";
import { UserSetting } from "@/lib/generated/prisma";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import StatusCard from "./StatusCard";

export default function Overiew({ userSetting }: { userSetting: UserSetting }) {
  const [Daterange, setDaterange] = useState<{ from: Date; to: Date }>({
    //set form start date
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  console.log(`Daterange: ${Daterange}`)
  return (
    <>
      <div className="flex flex-wrap items-end justify-between px-6 py-6 gap-2">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
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
      <div className="flex w-full flex-col gap-2">
        <StatusCard userSetting={userSetting} from={Daterange.from} to={Daterange.to}/>
      </div>
      {/* 2:52:13 */}
    </>
  );
}
