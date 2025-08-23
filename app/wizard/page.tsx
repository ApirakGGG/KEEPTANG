import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { CurrencyBox } from "../Mycomponents/CurrencyBox";

export default async function Wizard() {
  //เช็คuser
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="container flex flex-col max-w-2xl items-center justify-between gap-4">
      <div>
        <h1 className="text-center text-3xl">
          HI! , <span className="font-bold">{user.fullName} </span>
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          เลือกสกุลเงินที่ต้องการบันทึก
        </h2>
        <h3 className="text-center mt-2 text-sm text-muted-foreground">
          สามารถเปลี่ยนการตั้งค่าได้ตลอดเวลา
        </h3>
      </div>
      <Separator />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>สกุลเงิน</CardTitle>
          <CardDescription>เลือกสกุลเงินเริ่มต้น</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyBox />
        </CardContent>
      </Card>

      <Separator />
      <Button className="w-full" asChild>
        <Link href={"/"}>กลับไปหน้า Dashboard</Link>
      </Button>
    </div>
  );
}
