import { PrismaClient } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { tr } from "date-fns/locale";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  //period
  const period = await getHistoryPeriod(user.id);
  return Response.json(period);
}
export type getHistoryPeriodResponseType = Awaited<
  ReturnType<typeof getHistoryPeriod>
>;

async function getHistoryPeriod(userId: string) {
  const prisma = new PrismaClient();

  // query month_history
  const result = prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "asc",
    },
  });

  //map year
  const year = (await result).map((el) => el.year);
  if (year.length === 0) {
    // return current year
    return [new Date().getFullYear()];
  }

  return year;
}
