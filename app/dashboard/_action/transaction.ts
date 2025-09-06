"use server";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { redirect } from "next/navigation";

export default async function CreateTransactions(
  form: CreateTransactionSchemaType
) {
  const prisma = new PrismaClient();
  const user = await currentUser();
  const parseBody = CreateTransactionSchema.safeParse(form);
  if (!parseBody.success) {
    throw new Error(parseBody.error.message);
  }

  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = parseBody.data;
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("ไม่พบหมวดหมู่");
  }

  // สร้าง transaction
  await prisma.$transaction([
    //สร้างธุรกรรมให้user
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryicon: categoryRow.icon,
      },
    }),

    //update month aggregates  table
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          //format before upsert
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      //create
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      //update
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    //update year aggregates  table
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          //format before upsert
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      //create
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: type === "expense" ? amount : 0,
        expense: type === "income" ? amount : 0,
      },
      //update
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
