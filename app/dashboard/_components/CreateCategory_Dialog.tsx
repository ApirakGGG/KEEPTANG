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
import { CircleOff, PlusSquare, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { DialogClose } from "@radix-ui/react-dialog";

interface Props {
  type: TransactionType;
}

export default function CreateCategoryDialog({ type }: Props) {
  const [open, setOpen] = useState(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3"
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          สร้าง
        </Button>
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
          <form className="space-y-8">
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
            {/* 1:51:39 */}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
