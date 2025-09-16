"use client";

import { Period, TimeFrame } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SkeletonWrapper from "@/app/Mycomponents/SkeletonWrapper";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { getHistoryPeriodResponseType } from "@/app/api/history_period/route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: TimeFrame;
  setTimeFrame: (timeframe: TimeFrame) => void;
}

export default function HistoryPeriodSelected({
  period,
  setPeriod,
  timeframe,
  setTimeFrame,
}: Props) {
  // historyPeriod Query
  const historyPeriod = useQuery<getHistoryPeriodResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: async () => {
      const historydata = await axios.get(`/api/history_period`);
      return historydata.data;
    },
  });
  console.log(`historyPeriod : ${historyPeriod.data} `);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeFrame(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>

      <div className="flex flex-wrap gap-2 items-center">
        {/* Year Selected */}
        <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
          <YearSelected
            period={period}
            setPeriod={setPeriod}
            year={historyPeriod.data || []}
          />
        </SkeletonWrapper>
        {/* 3:48:05 */}

        {timeframe === "month" && (
          //  {/* Month Selected */}
          <SkeletonWrapper
            isLoading={historyPeriod.isFetching}
            fullWidth={false}
          >
            <MonthSelected period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

//Year Selected
function YearSelected({
  period,
  setPeriod,
  year,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  year: getHistoryPeriodResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) =>
        setPeriod({
          month: period.month,
          year: parseInt(value),
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {/* map year history */}
        {year.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// MonthSelected
function MonthSelected({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) =>
        setPeriod({
          year: period.month,
          month: parseInt(value),
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {/* map month history */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) => {
          const monthStr = new Date(period.year, m, 1).toLocaleString(
            "default",
            { month: "long" }
          );
          return (
            <SelectItem key={m} value={m.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
