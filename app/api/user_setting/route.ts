/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//API USER Setting
export async function GET(req: Request) {
  const prisma = new PrismaClient();
  //check user
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  let userSetting = await prisma.userSetting.findUnique({
    where: {
      userId: user.id,
    },
  });
  console.log("DATA:", userSetting);

  if (!userSetting) {
    userSetting = await prisma.userSetting.create({
      data: {
        userId: user.id,
        currency: "฿THB",
      },
    });
  }

  //ตรวจสอบความถูกต้องของหน้าแรกที่ใช้สกุลเงินของผู้ใช้
  revalidatePath("/");
  return Response.json(userSetting);
}
