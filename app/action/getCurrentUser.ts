/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  // try {
  //   const prisma = new PrismaClient();
  //   //check user
  //   const user = await currentUser();

  //   if (!user.id) {
  //     return null;
  //   }

  //   const getcurrentUser = await prisma.userSetting.findUnique({
  //     where: {
  //       userId: user.id ,
  //     },
  //   });

  //   if (!currentUser) return null;

  //   return {
  //     ...currentUser
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return null;
  // }
}
