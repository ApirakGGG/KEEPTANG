"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HistoryPeriodSelected from "./HistoryPeriodSelected";
import { UserSetting } from "@/lib/generated/prisma";
import { getFormatterForCurrency } from "@/lib/getFormatterForCurrency";
import { Period, TimeFrame } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SkeletonWrapper from "@/app/Mycomponents/SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

export default function History({ userSetting }: { userSetting: UserSetting }) {
  // timeframe start at month
  const [timeframe, setTimeFrame] = useState<TimeFrame>("month");
  // period
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  console.log(`data1 : ${timeframe} : ${period}`);

  // formatter
  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSetting.currency);
  }, [userSetting.currency]);

  //history Data query
  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: async () => {
      const historyData = await axios.get(
        `/api/history_data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
      );
      //return data
      return historyData.data;
    },
  });
  console.log(`historyDataQuery : ${historyDataQuery.data}`);

  //check data Available
  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;
  console.log(`dataAvailable : ${dataAvailable}`);

  return (
    <div className="mt-3">
      <h2 className="mt-12 text-3xl font-bold px-7">HISTORY</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            {/* HistoryPeriodSelected */}
            <HistoryPeriodSelected
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeFrame={setTimeFrame}
            />
            {/* Badge Types */}
            <div className="flex h-10 gap-2">
              {/* Badge รายได้ */}
              <Badge
                variant={"outline"}
                className="text-sm flex items-center gap-2 "
              >
                <div className="h-4 rounded-full bg-green-500"></div>
                รายได้
              </Badge>
              {/* Badge รายจ่าย */}
              <Badge
                variant={"outline"}
                className="text-sm flex items-center gap-2 "
              >
                <div className="h-4 rounded-full bg-red-500"></div>
                รายจ่าย
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable && (
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart
                  height={300}
                  data={historyDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    {/* incomeBar */}
                    <linearGradient id="incomeBar" x1={0} y1={0} x2={0} y2={1}>
                      <stop offset={"0"} stopColor="#10b987" opacity={"1"} />
                      <stop offset={"1"} stopColor="#10b987" opacity={"0"} />
                    </linearGradient>

                    {/* expenseBar */}
                    <linearGradient id="expenseBar" x1={0} y1={0} x2={0} y2={1}>
                      <stop offset={"0"} stopColor="#ef4444" opacity={"1"} />
                      <stop offset={"1"} stopColor="#ef4444" opacity={"0"} />
                    </linearGradient>
                  </defs>
                  {/* CartesianGrid */}
                  <CartesianGrid
                    strokeDasharray={" 5 5"}
                    strokeOpacity={"0.2"}
                    vertical={false}
                  />
                  {/* XAxis & YAxis*/}
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeframe === "year") {
                        return date.toLocaleDateString("default", {
                          month: "long",
                        });
                      }
                      return date.toLocaleDateString("default", {
                        day: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={"income"}
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey={"expense"}
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  {/* Tooltip */}
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                      <CustomTooltop formatter={formatter} {...props} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!dataAvailable && (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                <p className="text-sm text-muted-foreground">เลือกเวลา</p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

//CustomTooltop
function CustomTooltop({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;
  return (
    <div className="min-w-[300px] rounded bg-background p-4">
      {/* expense */}
      <TooltipRow
        formatter={formatter}
        label="รายจ่าย"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      {/* income */}
      <TooltipRow
        formatter={formatter}
        label="รายได้"
        value={income}
        bgColor="bg-green-500"
        textColor="text-green-500"
      />
      {/* balance */}
      <TooltipRow
        formatter={formatter}
        label="คงเหลือ"
        value={income - expense}
        bgColor="bg-yellow-500"
        textColor="text-yellow-500"
      />
    </div>
  );
}

// TooltipRow
function TooltipRow({
  label,
  formatter,
  value,
  bgColor,
  textColor,
}: {
  label: string;
  formatter: Intl.NumberFormat;
  value: number;
  bgColor: string;
  textColor: string;
}) {
  const formattingFn = useCallback(
    (v: number) => {
      return formatter.format(v);
    },
    [formatter]
  );
  return (
    <div className="flex items-center gap-2 ">
      <div className={cn(`h-4 w-4 rounded-full `, bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn(`h-4 w-4 rounded-full `, textColor)}>
          <CountUp
            className="text-sm "
            duration={0.5}
            preserveValue
            end={value}
            decimal={"0"}
            formattingFn={formattingFn}
          />
        </div>
      </div>
    </div>
  );
}
