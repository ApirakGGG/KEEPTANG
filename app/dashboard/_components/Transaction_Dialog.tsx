
"use client";
import { TransactionType } from "@/lib/transactionType";
import React, { ReactNode, useState } from "react";
import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  CreateTransactionSchemaType,
  CreateTransactionSchema,
} from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./Category_Picker";
import { Currencies, Currency } from "@/lib/currencies";
import { useQuery } from "@tanstack/react-query";
import { UserSetting } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

export default function Transaction_Dialog({ trigger, type }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const [currenyuser, setCurrecyUser] = useState<Currency | null>(null);

  //useQuerry
  const userSetting = useQuery<UserSetting>({
    queryKey: ["userSetting"],
    //Fetch Api route
    queryFn: () => fetch("/api/user_setting").then((res) => res.json()),
  });

  //formatLang
  const formattype = (type?: TransactionType) => {
    if (!type) return;
    if (type === "income") return "รายได้";
    if (type === "expense") return "รายจ่าย";
  };

  React.useEffect(() => {
    if (!userSetting.data) return;
    const userCurrency =
      Currencies.find(
        (currency) => currency.value === userSetting.data.currency
      ) || null;

    // set start user currency
    setCurrecyUser(userCurrency);
  }, [userSetting.data]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* {"wrap trigger ด้วยการตรวจสอบ "} */}
        {React.isValidElement(trigger) ? trigger : <span>{trigger}</span>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            สร้างธุรกรรม
            <span
              className={cn(
                "m-1",
                //check type to change color
                type === "income" ? "text-green-500" : "text-red-500"
              )}
            >
              {formattype(type)}
            </span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {/* check default value */}
                    <Input
                      defaultValue={cn(
                        type === "income"
                          ? `รายได้ ${currenyuser?.value}`
                          : `รายจ่าย ${currenyuser?.value}`
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {cn(
                      type === "income"
                        ? "อธิบายเกี่ยวกับรายได้"
                        : "อธิบายเกี่ยวกับรายจ่าย"
                    )}
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>amount</FormLabel>
                  <FormControl>
                    {/* check default value */}
                    <Input
                      defaultValue={cn(type === "income" ? "0" : "0")}
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {cn(
                      type === "income"
                        ? `จำนวนเงินรายได้ ${currenyuser?.value}`
                        : `จำนวนเงินรายจ่าย ${currenyuser?.value}`
                    )}
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2">
              {/* category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type}  {...field} />
                    </FormControl>
                    <FormDescription>
                      {cn(
                        type === "income"
                          ? "เลือกหมวดหมู่รายได้"
                          : "เลือกหมวดหมู่รายจ่าย"
                      )}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        {/* close content */}
        <DialogFooter>
          <DialogClose>
            <Button
              variant={"outline"}
              type="button"
              onClick={() => {
                form.reset();
              }}
            >
              ยกเลิก
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
