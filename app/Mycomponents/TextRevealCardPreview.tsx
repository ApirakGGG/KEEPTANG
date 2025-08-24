"use client";
import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from "@/components/ui/text-reveal-card";
import React from "react";


export function TextRevealCardPreview() {
  return (
    <div className="flex items-center justify-center opacity-75 rounded-2xl">
      <TextRevealCard
        text=" WEBSITE จัดการรายรับ-รายจ่ายสำหรับนักศึกษา"
        revealText="พร้อมสรุปยอดและแจ้งเตือนงบประมาณ พร้อมจดบันทึกด้วยเสียงฟรี"
      >
        <TextRevealCardTitle>
          เริ่มต้นวางแผน
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          การเงินอย่างมีวินัย 
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}

