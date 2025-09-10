import { Button } from "@/components/ui/button";
import { PrismaClient } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Transaction_Dialog from "./_components/Transaction_Dialog";
import Overview from "./_components/Overview";

export default async function Dashboard() {
  const prisma = new PrismaClient();
  //user session
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  //userSeting checking
  const userSetting = await prisma.userSetting.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSetting) {
    redirect("/wizard");
  }


  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
           {/* User + Buttons */}
        <div className=" flex flex-wrap items-center justify-between gap-6 py-6 px-6">
          {" "}
          <h1 className="text-center text-3xl">
            HI! , <span className="font-bold">{user.fullName} </span>
          </h1>
          <div className="flex items-center gap-3">
            {/* wrap button INCOME */}
            <Transaction_Dialog
              trigger={
                <Button
                  variant={"outline"}
                  className="px-5 py-1 font-bold cursor-pointer border-yellow-500  hover:bg-green-300 text-green-500 hover:text-green-700"
                >
                  รายได้
                </Button>
              }
              // กำหนดtype เพื่อให้ตรงกับในDB
              type={"income"}
            />
            {/* wrap button EXPENSE */}
            <Transaction_Dialog
              trigger={
                <Button
                  variant={"outline"}
                  className="px-5 py-1 font-bold cursor-pointer border-red-500  hover:bg-red-300 text-red-500 hover:text-red-700"
                >
                  รายจ่าย
                </Button>
              }
              // กำหนดtype เพื่อให้ตรงกับในDB
              type={"expense"}
            />
          </div>
        </div>
      </div>
      <Overview userSetting={userSetting} />
    </div>
  );
}
