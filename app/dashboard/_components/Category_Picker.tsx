"use client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TransactionType } from "@/lib/transactionType";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import CreateCategoryDialog from "./CreateCategory_Dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  type: TransactionType;
  onChange: (value: string) => void
}

export default function CategoryPicker({ type , onChange }: Props) {
  const [open, setOpen] = useState(false); //open popover
  const [value, setValue] = useState("");

  //change category 
  useEffect(() => {
    if(!value) return;
    onChange(value);//เปลี่ยน category
  }, [value, onChange])

  //query data
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const res = await axios.get(`/api/category?type=${type}`);
      // return data & declare type
      return res.data;
    },
  });
  // console.log("Qurey", categoriesQuery.data);

  //view when selectedCategories Input
  const selectedCategories = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );

  //create&select category value
  const successCallback = useCallback(
    (categories: Category) => {
      setValue(categories.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  // console.log("selectedCategories", selectedCategories);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between text-center"
        >
          {" "}
          {selectedCategories ? (
            <CategoryRow category={selectedCategories} />
          ) : (
            "เลือกหมวดหมู่"
          )}
          <ChevronsUpDown className="ml-2 w-4 h-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="ค้นหาหมวดหมู่" />
          <CreateCategoryDialog
            type={type}
            OnsuccessCallback={successCallback}
          />
          <CommandEmpty>
            <p>ไม่มีหมวดหมู่</p>
            <p className="text-xs text-muted-foreground">สามารถสร้างหมวดหมู่</p>
          </CommandEmpty>

          <CommandGroup>
            <CommandList>
              {" "}
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: Category) => (
                  <CommandItem
                    key={category.userId}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    {/* ข้อมูลที่map ไว้แล้ว */}
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "mr-2 w-4 h-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
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
