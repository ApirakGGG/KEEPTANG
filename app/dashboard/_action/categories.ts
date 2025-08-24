"use server";
import { currentUser } from "@clerk/nextjs/server";
import { CreateCategory, CreateCategoryType } from "@/schema/categories";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/lib/generated/prisma";

//Send category formData
export async function CreateCategoryForm(form: CreateCategoryType) {
  const parseBody = CreateCategory.safeParse(form);
  const prisma = new PrismaClient();
  const user = await currentUser();
  if (!parseBody.success) {
    throw new Error("bad request");
  }

  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parseBody.data;

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}
