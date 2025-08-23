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
    <div className="grid grid-cols-2 gap-5 space-x-28 justify-around mt-15  md:flex md:flex-row ">
      {content.map((item) => (
        <div
          key={item.id}
          className="h-[20vh] w-full flex items-center justify-center  "
        >
          {/* 3D footer */}
          <PinContainer title="KEEPTANG > เก็บตัง">
            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 md:w-[30vh] h-[10rem] rounded-xl">
              <div className="flex flex-col justify-center items-center text-base !m-0 !p-0 font-normal">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-800 dark:text-white">
                  {item.text}
                </h3>
                <br />
                <span className="text-slate-800 font-bold dark:text-white ">
                  {item.sub}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center w-full rounded-lg mt-4 ">
                <item.icon className="text-yellow-800 size-16" />
              </div>
            </div>
          </PinContainer>
        </div>
      ))}
    </div>
  );
};

export default FooterContent;
