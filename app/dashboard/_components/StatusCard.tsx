"use client";
import { useQuery } from "@tanstack/react-query";
import { UserSetting } from "@/lib/generated/prisma";
import axios from "axios";
import { GetBalanceStatusResponseType } from "@/app/api/status/balance/route";
import { DateUTCDate } from "@/lib/helper";
import { ReactNode, useCallback, useMemo } from "react";
import { getFormatterForCurrency } from "@/lib/getFormatterForCurrency";
import SkeletonWrapper from "@/app/Mycomponents/SkeletonWrapper";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import CountUp from 'react-countup';

interface Props {
  from: Date;
  to: Date;
  userSetting: UserSetting;
}

export default function StatusCard({ from, to, userSetting }: Props) {
  //query
  const statusQuery = useQuery<GetBalanceStatusResponseType>({
    queryKey: ["overview", "status", from, to],
    queryFn: async () => {
      console.log(`Date From ${DateUTCDate(from)} : To ${DateUTCDate(to)}`);
      const dateFromTo = await axios.get(
        `/api/status/balance?from=${DateUTCDate(from)}&to=${DateUTCDate(to)}`
      );
      return dateFromTo.data;
    },
  });
  console.log("statusQuery:", statusQuery.data);

  //format usercurrency
  const format = useMemo(() => {
    return getFormatterForCurrency(userSetting.currency);
  }, [userSetting.currency]);

  //create income , expense & balance
  const income = statusQuery.data?.income || 0;
  const expense = statusQuery.data?.expense || 0;
  const balance = income - expense;
  console.log("BALANCE:", balance);
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statusQuery.isFetching}>
        {/* UI INCOME */}
        <StatCard
          format={format}
          value={income}
          title={"INCOME"}
          icon={
            <TrendingUp
              className="h-12 w-12 items-center rounded-lg
            p-2 text-green-500 bg-green-300 font-bold
            "
            />
          }
        />

        {/* UI EXPENSE */}
        <StatCard
          format={format}
          value={expense}
          title={"EXPENSE"}
          icon={
            <TrendingDown
              className="h-12 w-12 items-center rounded-lg
            p-2 text-red-500 bg-red-300 font-bold
            "
            />
          }
        />

        {/* UI BALANCE */}
        <StatCard
          format={format}
          value={balance}
          title={"BALANCE"}
          icon={
            <Wallet
              className="h-12 w-12 items-center rounded-lg
            p-2 text-yellow-500 bg-yellow-300 font-bold
            "
            />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

//StatCard create for show data income , expense & balance
function StatCard({
  format,
  value,
  title,
  icon,
}: {
  format: Intl.NumberFormat;
  icon: ReactNode;
  title: String;
  value: number;
}) {
  const formatFN = useCallback(
    (value: number) => {
      return format.format(value);
    },
    [format]
  );
  return (
    <Card className="flex h-20 w-full items-center gap-2 p-4 py-3">
      <div className="flex flex-row items-center gap-5">
        {icon}
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFN}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
