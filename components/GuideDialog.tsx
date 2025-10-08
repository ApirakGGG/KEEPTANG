"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import Image from "next/image";

export default function TransactionGuideDialog() {

    const dataguide = [
        {id: 1, content: "" , image: "/Guide_App/1.jpg"},
        {id: 2, content: "" , image: "/Guide_App/2.jpg"},
        {id: 3, content: "" , image: "/Guide_App/3.jpg"},
        {id: 4, content: "" , image: "/Guide_App/4.jpg"},
        {id: 5, content: "" , image: "/Guide_App/5.jpg"},
        {id: 6, content: "" , image: "/Guide_App/6.jpg"},
    ]
  return (
    <Dialog>
      {/* ปุ่มเปิด Modal */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm hover:bg-primary hover:text-white transition-all"
        >
          <Info className="h-4 w-4" />
          คู่มือการใช้งาน
        </Button>
      </DialogTrigger>

      {/* เนื้อหาใน Modal */}
      <DialogContent
        className="!w-[100vh] !max-w-6xl h-[80vh] overflow-hidden bg-card rounded-2xl shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            🧾 คู่มือการใช้งาน
          </DialogTitle>
          <DialogDescription>
            อธิบายรายละเอียดและส่วนประกอบทั้งหมด
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                🔹 ส่วนประกอบหลักของหน้า
              </h2>

              <h3 className="mt-3 font-medium text-foreground">
                1. ฟิลเตอร์ (Filter)
              </h3>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>
                  <strong>Filter หมวดหมู่ (Category Filter)</strong> —
                  เลือกเฉพาะหมวดหมู่ที่ต้องการ เช่น อาหาร, เดินทาง, เงินเดือน
                  โดยสามารถเลือกหลายค่าพร้อมกันได้
                </li>
                <li>
                  <strong>Filter ประเภท (Type Filter)</strong> —
                  แยกดูเฉพาะรายรับหรือรายจ่าย
                  โดยมีสีเขียวแทนรายรับและสีแดงแทนรายจ่าย
                </li>
              </ul>

              <h3 className="mt-4 font-medium text-foreground">
                2. ปุ่มควบคุม (Controls)
              </h3>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>
                  <strong>Export CSV</strong> — ส่งออกข้อมูลที่กรองแล้วเป็นไฟล์
                  .csv เพื่อใช้ต่อใน Excel หรือโปรแกรมบัญชีอื่น
                </li>
                <li>
                  <strong>View Options</strong> —
                  เลือกซ่อนหรือแสดงคอลัมน์ที่ต้องการ เช่น วันที่ หรือจำนวนเงิน
                </li>
              </ul>

              <h3 className="mt-4 font-medium text-foreground">
                3. ตารางข้อมูล (Transaction Table)
              </h3>
              <p className="mt-1">
                ตารางออกแบบให้ใช้งานง่าย มีหัวข้อแบบ Gradient
                และแถวสลับสีเพื่อให้อ่านง่าย:
              </p>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>🏷 หมวดหมู่พร้อมไอคอน</li>
                <li>💬 คำอธิบายรายการ</li>
                <li>📅 วันที่บันทึก</li>
                <li>💵 ประเภท (รายรับ/รายจ่าย) พร้อมพื้นหลังสี</li>
                <li>💰 จำนวนเงินแสดงตามสกุลเงินที่ตั้งไว้</li>
              </ul>

              <h3 className="mt-4 font-medium text-foreground">
                4. Pagination (การเปลี่ยนหน้า)
              </h3>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>ปุ่ม Previous / Next เพื่อเลื่อนหน้าข้อมูล</li>
                <li>แสดงหมายเลขหน้า เช่น “Page 1 of 4”</li>
                <li>ปุ่มจะถูกปิดอัตโนมัติเมื่ออยู่หน้าสุดท้ายหรือหน้าแรก</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mt-6">
                🧠 จุดเด่นของ UI ที่ปรับแล้ว
              </h2>
              <div className="overflow-x-auto mt-3">
                <table className="min-w-full text-sm border border-border rounded-md">
                  <thead>
                    <tr className="bg-muted/40 text-left">
                      <th className="p-2 border-b">รายการ</th>
                      <th className="p-2 border-b">รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b">🎨 โทนสี</td>
                      <td className="p-2 border-b">
                        ใช้สีอ่อนกับ <code>bg-card</code> และ{" "}
                        <code>text-muted-foreground</code>{" "}
                        เข้ากับทั้งโหมดมืดและสว่าง
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">📱 Responsive</td>
                      <td className="p-2 border-b">
                        รองรับทุกขนาดหน้าจอ ทั้งมือถือและเดสก์ท็อป
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">📂 Export CSV</td>
                      <td className="p-2 border-b">
                        ส่งออกเฉพาะข้อมูลที่กรองไว้ ไม่ใช่ทั้งหมด
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">🧭 การนำทาง</td>
                      <td className="p-2 border-b">
                        จัด Layout สมดุลระหว่าง Filter / ปุ่ม / ตาราง
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">💬 UX</td>
                      <td className="p-2 border-b">
                        เพิ่ม Hover Effect และ Transition เพื่อความลื่นไหล
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* image guide */}
              <div className="mt-2">
                {dataguide.map((i) => (
                   <div key={i.id} className="">
                     <Image src={i.image} alt="Guide_App" width={1000} height={1000} className="object-cover mt-2" />
                   </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
