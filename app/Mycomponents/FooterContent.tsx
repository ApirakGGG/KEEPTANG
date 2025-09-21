"use client";
import {
  ChartNoAxesColumnIncreasing,
  CircleCheckBig,
  HandCoins,
} from "lucide-react";
import { PinContainer } from "@/components/ui/3d-pin";
import React from "react";

const FooterContent = () => {
  const content = [
    {
      id: 1,
      icon: CircleCheckBig,
      text: "บันทึกรายรับรายจ่าย",
      sub: "ได้อย่างรวดเร็ว",
    },
    {
      id: 2,
      icon: ChartNoAxesColumnIncreasing,
      text: "สรุปการเงินรายวัน",
      sub: "/สัปดาห์/เดือน",
    },
    { id: 3, icon: HandCoins, text: "กำหนดเป้าหมาย", sub: "การออม" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 -mt-2 px-3 md:px-1 lg:px-1">
      {content.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-center gap-3 sm:gap-5 md:gap-7 lg:gap-7"
        >
          {/* 3D footer */}
          <PinContainer title="KEEPTANG > เก็บตัง">
            <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[18rem] h-[10rem] rounded-xl">
              <div className="flex flex-col justify-center items-center text-base font-normal">
                <h3 className="max-w-xs font-bold  text-base text-slate-800 dark:text-white">
                  {item.text}
                </h3>
                <br />
                <span className="text-slate-800 font-bold dark:text-white ">
                  {item.sub}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center w-full rounded-lg mt-4 ">
                <item.icon className="text-yellow-800 size-12" />
              </div>
            </div>
          </PinContainer>
        </div>
      ))}
    </div>
  );
};

export default FooterContent;
