import { Max_Date_Range_Days } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import {z}   from "zod";

export const OverviewQuerySchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
}).refine((args) => {
    const {from,to} = args;
    const days = differenceInDays(to,from);

    const isValidRange = days >= 0 && Max_Date_Range_Days;
    return isValidRange
})