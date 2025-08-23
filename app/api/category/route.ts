import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/lib/generated/prisma";
import z from "zod";

export async function GET(req: Request) {
  const user = await currentUser();
  const prisma = new PrismaClient();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);
  const paramsType = searchParams.get("type");

  const validator = z.enum(["income", "expense"]).nullable();
  const queryParams = validator.safeParse(paramsType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), //รวมtypeไว้ในตัวกรองหากมีการกำหนดไว้
    },
    orderBy: {
        name: "asc"
    }
  });
return Response.json(categories)
}
