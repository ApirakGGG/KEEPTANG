"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardContent from "@mui/material/CardContent";
import React from "react";
import { CurrencyBox } from "../Mycomponents/CurrencyBox";
import { TransactionType } from "@/lib/transactionType";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "../Mycomponents/SkeletonWrapper";
import axios from "axios";
import { PlusSquare, Trash, TrendingDown, TrendingUp } from "lucide-react";
import CreateCategoryDialog from "../dashboard/_components/CreateCategory_Dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/generated/prisma";
import DeleteCategoryDialog from "../dashboard/_components/DeleteCategoryDialog";

export default function page() {
  return (
    <>
      {/* header */}
      <div className="bg-card px-5">
        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </div>
      {/* end header */}
      <div className="flex flex-col gap-4 p-4">
        <Card>
          {/* card header */}
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>เปลี่ยนค่าเริ่มต้นสกุลเงิน</CardDescription>
          </CardHeader>
          {/* card content */}
          <CardContent>
            {/* components set change currency */}
            <CurrencyBox />
          </CardContent>
        </Card>
        {/* func CategoryList */}
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}

function CategoryList({ type }: { type: TransactionType }) {
  const categoryQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const category = await axios.get(`/api/category?type=${type}`);
      return category.data;
    },
  });

  // data ต้องมาก 0 เท่านั้นถ้าเป็น Array
  const dataAvailable = categoryQuery.data && categoryQuery.data.length > 0;

  console.log(`categoryQuery ${categoryQuery}`);
  return (
    <SkeletonWrapper isLoading={categoryQuery.isLoading}>
      <Card>
        {/* header */}
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-5">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400 p-2 text-red-600" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-green-400 p-2 text-green-600" />
              )}
            </div>

            <div>
              หมวดหมู่ {type === "income" ? "รายได้" : "รายจ่าย"}
              <div className="text-sm text-muted-foreground">
                sorted by name
              </div>
            </div>

            {/* 3:55:00 */}
            <CreateCategoryDialog
              type={type}
              OnsuccessCallback={() => categoryQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="w-4 h-4" />
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {/* ถ้าไม่มี Data*/}
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              ไม่มีหมวดหมู่
              <span
                className={cn(
                  "ml-1",
                  type === "income" ? "text-green-500" : "text-red-500"
                )}
              >
                {type === "income" ? "รายได้" : "รายจ่าย"}
              </span>{" "}
            </p>

            <p className="text-sm text-muted-foreground">สร้างข้อมูล</p>
          </div>
        )}
        {/* ถ้ามี Data*/}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoryQuery.data.map((c: Category) => (
              <CategoryCard category={c} key={c.name} />
            ))}
          </div>
        )}

        {/* content */}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div
      className="flex border-separate flex-col justify-between rounded-md
    border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]"
    >
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-2xl" role="img">
          {category.icon}
        </span>
        <span className="text-sm">{category.name}</span>
      </div>

      {/* remove button */}
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            variant={"secondary"}
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
          >
            <Trash className="h-4 w-4" /> ลบ
          </Button>
        }
      />
    </div>
  );
}
