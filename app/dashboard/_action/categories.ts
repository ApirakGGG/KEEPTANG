"use server";
import { currentUser } from "@clerk/nextjs/server";
import {
  CreateCategory,
  CreateCategoryType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
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

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const prisma = new PrismaClient();
  const parseBody = DeleteCategorySchema.safeParse(form);
  if (!parseBody.success) {
    throw new Error("bad request");
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const category = await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parseBody.data.name,
        type: parseBody.data.type,
      }
    }
  })
}
