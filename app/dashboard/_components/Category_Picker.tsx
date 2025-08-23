/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { TransactionType } from "@/lib/transactionType";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import CreateCategoryDialog from "./CreateCategory_Dialog";

interface Props {
  type: TransactionType;
}

export default function CategoryPicker({ type }: Props) {
  const [open, setOpen] = useState(false); //open popover
  const [value, setValue] = useState("");

  const catagoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const res = await axios.get(`/api/category?type=${type}`);
      // return data & declare type
      return res.data.data as Category[];
    },
  });

  const selectedCategories = catagoriesQuery.data?.find(
    (category: Category) => category.name === value,

  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between "
        >
          {" "}
          {selectedCategories ? (
            <CategoryRow category={selectedCategories} />
          ) : (
            "เลือกหมวดหมู่"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="ค้นหาหมวดหมู่" />
          <CreateCategoryDialog type={type} />
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="icon">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
