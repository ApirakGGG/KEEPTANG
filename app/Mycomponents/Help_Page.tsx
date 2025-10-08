"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function HelpDialog() {
  return (
    <Dialog>
      {/* ปุ่มกดเปิด Help */}
      <DialogTrigger asChild>
         <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm hover:bg-primary hover:text-white transition-all"
                >
          Help
        </Button>
      </DialogTrigger>

      {/* เนื้อหาภายใน Dialog */}
      <DialogContent className="max-w-7xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            📚 Help & Support
          </DialogTitle>
          <DialogDescription>
            คู่มือการใช้งานเว็บบันทึกรายรับ-รายจ่ายสำหรับนักศึกษา
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm text-muted-foreground">
          {/* 1. วิธีใช้งาน */}
          <section>
            <h3 className="font-semibold text-base mb-2">
              วิธีการใช้งาน (How to Use)
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>สมัครสมาชิกหรือเข้าสู่ระบบผ่าน Google</li>
              <li>เพิ่มรายการรายรับ/รายจ่าย และระบุจำนวนเงิน</li>
              <li>ดูสรุปกราฟรายวัน/เดือนในหน้า Dashboard</li>
              <li>ตั้งเป้าหมายการเก็บเงินเพื่อเช็กความคืบหน้า</li>
            </ul>
          </section>

          {/* 2. FAQ */}
          <section>
            <h3 className="font-semibold text-base mb-2">
              คำถามที่พบบ่อย (FAQ)
            </h3>
            <p className="mb-1">
              <strong>Q:</strong> ลืมรหัสผ่านทำไง? <br />
              <strong>A:</strong> กด “ลืมรหัสผ่าน” ที่หน้า Login
            </p>
            <p className="mb-1">
              <strong>Q:</strong> ❓ สมัครสมาชิกฟรีไหม? <br />
              <strong>A:</strong> ✅ ฟรี 100%
            </p>
            <p>
              <strong>Q:</strong> ข้อมูลปลอดภัยไหม? <br />
              <strong>A:</strong> ใช้ Supabase + SSL ปลอดภัยตามมาตรฐาน
            </p>
          </section>

          {/* 3. ติดต่อทีมงาน */}
          <section>
            <h3 className="font-semibold text-base mb-2">ติดต่อทีมงาน</h3>
            <p>Email: naratah012345@gmail.com</p>
            <p>GitHub: @ApirakGGG</p>
          </section>

          {/* 4. ลิงก์ที่เกี่ยวข้อง */}
          <section>
            <h3 className="font-semibold text-base mb-2">ลิงก์ที่เกี่ยวข้อง</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>🔗 Terms of Service – เงื่อนไขการใช้งาน</li>
              <li>🔗 Feedback – ฟอร์มแสดงความคิดเห็น</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
