'use client'
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteTransaction } from "../_action/DeleteTransaction";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
}

export default function DeleteTransactionDialog({
  open,
  setOpen,
  transactionId,
}: Props) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      toast.success("ลบ transaction เรียบร้อย", {
        id: transactionId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });
    },
    onError: () => {
      toast.error(`เกิดข้อผิดพลาดโปรดลองอีกครั้ง`, {
        id: transactionId,
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
              toast.loading(`กำลังลบหมวดหมู่ ${transactionId}`, {
                id: transactionId,
              });
              deleteMutation.mutate(transactionId);
            }}
          >
            ตกลง
          </AlertDialogAction>
        </DialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
