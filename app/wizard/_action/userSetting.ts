"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSetting_zod";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
  const prisma = new PrismaClient();

  // UpdateUserCurrencySchema to zod
  const parseBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parseBody.success) {
    throw parseBody.error;
  }

  const user = await currentUser();
  // ถ้าไม่มีuser session redirect ไป sign-in page
  if (!user) {
    redirect("/sign-in");
  }

  const userSetting = await prisma.userSetting.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });

  // return userSetting value
  return userSetting
}
