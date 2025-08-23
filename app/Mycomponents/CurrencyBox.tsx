"use client";

import * as React from "react";

import { useMediaQuery } from "@react-hook/media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SklWraper from "./SkeletonWrapper";
import { UserSetting } from "@/lib/generated/prisma";
import { UpdateUserCurrency } from "../wizard/_action/userSetting";
import { toast } from "sonner";

export function CurrencyBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCurrency, setSelectedCurrency] =
    React.useState<Currency | null>(null);

  //useQuerry
  const userSetting = useQuery<UserSetting>({
    queryKey: ["userSetting"],
    //Fetch Api route
    queryFn: () => fetch("/api/user_setting").then((res) => res.json()),
  });

  //find currency for currency BOX

  React.useEffect(() => {
    if (!userSetting.data) return;
    console.log("userSetting.data.currency", userSetting.data.currency);
    console.log(
      "Currencies",
      Currencies.map((c) => c.label)
    );
    const userCurrency =
      Currencies.find(
        (currency) => currency.value === userSetting.data.currency
      ) || null;

    // set start user currency
    if (userCurrency) setSelectedCurrency(userCurrency);
  }, [userSetting.data]);

  //mutation tanStack
  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSetting) => {
      //update toast
      toast.success(`อัพเดตสกุลเงินเรียบร้อย`, {
        id: "update-currency",
      });

      setSelectedCurrency(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },

    onError: (error) => {
     console.error("error", error)
      toast.error(`เกิดข้อผิดพลาด`, { id: "update-currency" });
    },
  });

  //เลือกสกุลเงิน
  const selectOption = React.useCallback(
    (value: Currency | null) => {
      if (!value) {
        //popup error
        toast.error("เลือกสกุลเงิน");
        return;
      }

      toast.loading("กำลังอัพเดตสกุลเงิน...", {
        id: "update-currency",
      });

      //call mutation update currency
      mutation.mutate(value.value);
    },
    [mutation]
  );

  console.log("userSetting", userSetting);

  if (isDesktop) {
    return (
      //  isloading fetching wrapper เมื่อ loading component call form useQuery
      <SklWraper isLoading={userSetting.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={mutation.isPending}
              variant="outline"
              className="w-full justify-start"
            >
              {selectedCurrency ? (
                <>{selectedCurrency.label}</>
              ) : (
                <>+ เลือกสกุลเงิน</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <StatusList setOpen={setOpen} setSelectedCurrency={selectOption} />
          </PopoverContent>
        </Popover>
      </SklWraper>
    );
  }

  return (
    <SklWraper isLoading={userSetting.isFetching}>
      {" "}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            disabled={mutation.isPending}
            variant="outline"
            className="w-[150px] justify-start"
          >
            {selectedCurrency ? (
              <>{selectedCurrency.label}</>
            ) : (
              <>+ เลือกสกุลเงิน</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StatusList setOpen={setOpen} setSelectedCurrency={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SklWraper>
  );
}

function StatusList({
  setOpen,
  setSelectedCurrency,
}: {
  setOpen: (open: boolean) => void;
  setSelectedCurrency: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedCurrency(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
