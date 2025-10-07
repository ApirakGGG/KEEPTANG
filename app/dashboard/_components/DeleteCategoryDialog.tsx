"use client";

import { Category } from "@/lib/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { DeleteCategory } from "../_action/categories";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/transactionType";

interface Props {
  trigger: ReactNode;
  category: Category;
}

export default function DeleteCategoryDialog({ category, trigger }: Props) {
  const categoryIdentfier = `${category.name}-${category.type}`;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success("ลบหมวดหมู่เรียบร้อย", {
        id: categoryIdentfier,
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error(`เกิดข้อผิดพลาดโปรดลองอีกครั้ง`, {
        id: categoryIdentfier,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แน่ใจว่าต้องการลบ</AlertDialogTitle>
          <AlertDialogDescription>
            เมื่อลบแล้วไม่สามารถกู้คืนได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <DialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading(`กำลังลบหมวดหมู่ ${category.name}`, {
                id: categoryIdentfier,
              });
              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              });
            }}
          >
            ตกลง
          </AlertDialogAction>
        </DialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
