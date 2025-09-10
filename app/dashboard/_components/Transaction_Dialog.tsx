"use client";
import { TransactionType } from "@/lib/transactionType";
import React, { ReactNode, useCallback, useState } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./Category_Picker";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSetting } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Calendar1Icon, Loader2 } from "lucide-react";
import CreateTransactions from "../_action/transaction";
import { toast } from "sonner";
import { DateUTCDate } from "@/lib/helper";

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

export default function Transaction_Dialog({ trigger, type }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      amount: 0,
      type, // from props
      date: new Date(), // default today
    },
  });
  const [open, setOpen] = useState(false);

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

  //form value
  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  //query
  const queryClient = useQueryClient();

  //upsert date transaction
  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransactions,
    onSuccess: () => {
      toast.success("สร้างบันทึกสำเร็จ", {
        id: "create-transaction",
      });

      form.reset({
        type,
        date: new Date(),
        category: undefined,
      });

      //affter create
      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });
      setOpen((prev) => !prev);
    },
  });

  //submit function
  const onsubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading("กำลังสร้าง!!!!", {
        id: "create-transaction",
      });

      mutate({
        ...values,
        date: DateUTCDate(values.date),
      });
      // console.log("ส่งค่าไปที่ API:", values.amount);
      console.log(`API Send ${values}`);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
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
              render={({ field }) => {
                const { onChange, value, ...rest } = field; // แยก out onChange
                return (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(e.target.valueAsNumber)} // แปลงเป็น number
                        {...rest}
                      />
                    </FormControl>
                    <FormDescription>
                      {cn(
                        type === "income"
                          ? "จำนวนเงินรายได้"
                          : "จำนวนเงินรายจ่าย"
                      )}
                    </FormDescription>
                  </FormItem>
                );
              }}
            />

            {/* form change category */}
            <p>หมวดหมู่: {form.watch("category")}</p>
            <div className="flex items-center justify-between gap-2">
              {/* category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>หมวดหมู่</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        {...field}
                        onChange={handleCategoryChange}
                      />
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
              {/* calendar */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>วันที่ทำการบันทึก</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[200px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            // ใช้ locale ภาษาไทย
                            format(field.value, "PPP", { locale: th })
                          ) : (
                            <span>เลือกวันที่</span>
                          )}
                          <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      {/* content */}
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if(!value) return;
                            console.log(`Calendar : ${value}`);
                            field.onChange;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      {cn(
                        type === "income"
                          ? "เลือกวันที่สำหรับรายได้"
                          : "เลือกวันที่สำหรับรายจ่าย"
                      )}
                    </FormDescription>
                    {/* form meaasge */}
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        {/* close content */}
        <DialogFooter>
          <DialogClose asChild>
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
          <Button
            variant={"outline"}
            type="button"
            onClick={form.handleSubmit(onsubmit)}
            disabled={isPending}
          >
            {/* ispending checking */}
            {isPending ? (
              <Loader2 className="animate-spin duration-300" />
            ) : (
              "สร้างธุรกรรม"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


