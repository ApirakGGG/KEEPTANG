import { PrismaClient } from "@/lib/generated/prisma";
import { getFormatterForCurrency } from "@/lib/getFormatterForCurrency";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transaction = await getTransactionHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  //แก้ response.json()
  return Response.json(transaction);
}

export type GetTransactionHistoryType = Awaited<ReturnType<typeof getTransactionHistory>>

async function getTransactionHistory(userId: string, from: Date, to: Date) {
  const prisma = new PrismaClient();

  const userSetting = await prisma.userSetting.findUnique({
    where: {
      userId,
    },
  });
  if (!userSetting) {
    throw new Error("user setting not found");
  }
  const formatter = getFormatterForCurrency(userSetting.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions.map((t) => ({
    ...t,
    formattedAmount: formatter.format(t.amount),
  }));
}
