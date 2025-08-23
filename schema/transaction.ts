import { z } from "zod";

export const CreateTransactionSchema = z.object({
 amount: z.number(),
  date: z.date(),
  category: z.string(),
  type: z.enum(["income", "expense"]),
  description: z.string().optional(),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
