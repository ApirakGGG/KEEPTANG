import { Currencies } from "@/lib/currencies";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.some((currencies) => currencies.value === value);
    if (!found) {
      throw new Error(`สกุลเงินไม่ถูกต้อง: ${value}`);
    }
    console.log(`สกุลเงิน: ${value}`);
    return value;
  }),
});
