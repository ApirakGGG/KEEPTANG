"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/lib/transactionType";
import { cn } from "@/lib/utils";
import { CreateCategory, CreateCategoryType } from "@/schema/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CircleOff, Loader2, PlusSquare, X } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryForm } from "../_action/categories";
import { Category } from "@/lib/generated/prisma";
import { toast } from "sonner";

interface Props {
  type: TransactionType;
  OnsuccessCallback: (categories: Category) => void;
  trigger?: ReactNode;
}

export default function CreateCategoryDialog({
  trigger,
  type,
  OnsuccessCallback,
}: Props) {
  const [open, setOpen] = useState(false);
  //form
  const form = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategory),
    defaultValues: {
      type,
    },
  });

  //formatLang
  const formattype = (type?: TransactionType) => {
    if (!type) return;
    if (type === "income") return "รายได้";
    if (type === "expense") return "รายจ่าย";
  };

  //pull qurey
  const queryClient = useQueryClient();

  //FormData & form reset
  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategoryForm,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });
      // format formatsuccess
      const formatsuccess = () => {
        const time = new Date(data.createAt).toDateString();
        const summdata = `${data.name} ${data.icon} วันที่: ${time}`;
        return summdata;
      };
      toast.success(`สร้างหมวดหมู่ ${formatsuccess()} สำเร็จ`, {
        id: "create-category",
      });
      OnsuccessCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setOpen((prev) => !prev);
      console.log("สร้างหมวดหมู่สำเร็จ", formatsuccess());
    },
    onError: () => {
      toast.error(`เกิดข้อผิดพลาดโปรดลองอีกครั้ง`, {
        id: "create-category",
      });
    },
  });

  //onsubmit
  const onSubmit = useCallback(
    (value: CreateCategoryType) => {
      toast.loading("กำลังสร้างหมวดหมู่!!", {
        id: "create-category",
      });
      // set mutate from FormData & form reset
      mutate(value);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={"ghost"}
            className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3"
          >
            <PlusSquare className="mr-2 h-4 w-4" />
            สร้าง
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          สร้างหมวดหมู่
          <span
            className={cn(
              "m-1 gap-1",
              //check type to change color
              type === "income" ? "text-green-500" : "text-red-500"
            )}
          >
            {/* language is format */}
            {formattype(type)}
          </span>
        </DialogTitle>
        <DialogDescription>เลือกกลุ่มที่ต้องการสร้างหมวดหมู่</DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* categories */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>หมวดหมู่</FormLabel>
                  <FormControl>
                    {/* check default value */}
                    <Input
                      defaultValue={cn(
                        type === "income" ? `รายได้ ` : `รายจ่าย `
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {cn(
                      type === "income"
                        ? "หมวดหมู่เกี่ยวกับรายได้"
                        : "หมวดหมู่เกี่ยวกับรายจ่าย"
                    )}
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* icon */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon&Emoji</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[15vh] my-3 w-full relative"
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-7xl" role="img">
                                {field.value}
                              </span>
                              <Button variant={"outline"} className="text-xs">
                                เปลี่ยนไอคอน
                              </Button>
                              <div className="absolute right-2 top-2 z-30 ">
                                {/* เคลียร์ค่า icon ที่เลือก */}
                                <Button
                                  className="cursor-pointer"
                                  variant={"outline"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.setValue("icon", "");
                                  }}
                                >
                                  {" "}
                                  <X className="w-12 h-12 " />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[64px] w-[64px]" />
                              <p className="text-xs">เลือกไอคอน</p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    {cn(
                      type === "income"
                        ? "เลือกไอคอนหรืออิโมจิเกี่ยวกับรายได้"
                        : "เลือกไอคอนหรืออิโมจิเกี่ยวกับรายจ่าย"
                    )}
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
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
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {/* ispending checking */}
            {isPending ? (
              <Loader2 className="animate-spin duration-300" />
            ) : (
              "สร้างหมวดหมู่"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
