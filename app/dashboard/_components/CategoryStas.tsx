"use client";

import { UserSetting } from "@/lib/generated/prisma";
import { getFormatterForCurrency } from "@/lib/getFormatterForCurrency";
import { DateUTCDate } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import SkeletonWrapper from "@/app/Mycomponents/SkeletonWrapper";
import { TransactionType } from "@/lib/transactionType";
import { getCategoriesStatsResponseType } from "@/app/api/status/categories/route";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface Props {
  from: Date;
  to: Date;
  userSetting: UserSetting;
}

export default function CategoryStas<getCategoriesStatsResponseType>({
  from,
  to,
  userSetting,
}: Props) {
  //query categories
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: async () => {
      const categories = await axios.get(
        `/api/status/categories?from=${DateUTCDate(from)}&to=${DateUTCDate(to)}`
      );
      return categories.data;
    },
  });
  console.log(`categories : ${statsQuery.data}`);

  //format
  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSetting.currency);
  }, [userSetting.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap mt-3">
      {/* Income */}
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          data={statsQuery.data || []}
          type="income"
        />
      </SkeletonWrapper>

      {/* Expense */}
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          data={statsQuery.data || []}
          type="expense"
        />
      </SkeletonWrapper>
    </div>
  );
}

// CategoriesCard
function CategoriesCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  data: getCategoriesStatsResponseType;
  formatter: Intl.NumberFormat;
}) {
  const filterdata = data.filter((el: any) => el.type === type);
  console.log(`filterdata: ${filterdata}`);
  const total = filterdata.reduce(
    (acc: number, el: any) => acc + (el._sum?.amount || 0),
    0
  );
  console.log(`total: ${total}`);

  return (
    <Card className="h-100 w-full col-span-6 gap-2">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          หมวดหมู่ {type === "income" ? "รายได้" : "รายจ่าย"}
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {/* check filterdata === 0 */}
        {filterdata.length === 0 && (
          <div className="flex h-80 w-full flex-col items-center justify-center">
            ไม่มีข้อมูล
            <p className="text-sm text-muted-foreground">
              ลองเลือกช่วงเวลาอื่นหรือลองเพิ่มช่วงเวลาใหม่
              {type === "income" ? "รายได้" : "รายจ่าย"}
            </p>
          </div>
        )}

        {/* check filterdata > 0 */}
        {filterdata.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {/* map data */}
              {filterdata.map((i) => {
                const amount = i._sum.amount || 0;
                const percentage = total > 0 ? (amount * 100) / total : 0;
                console.log(`amount & percent: ${amount} : ${percentage}%`);
                return (
                  <div key={i.category} className="flex flex-col gap-2">
                    <div className="items-center flex justify-between">
                      {/* icon */}
                      <span className="flex items-center text-gray-400">
                        {i.categoryicon} {i.category}
                        {/* percen calculate */}
                        <span className="ml-3 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      {/* format amount */}
                      <span className="text-sm text-slate-500">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "text-green-500" : "text-red-500"
                      }
                    />
                  </div>
                  //   3:07:21
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
